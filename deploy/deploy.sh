#!/usr/bin/env bash
# Template installed on the VPS as /opt/stacks/my_blog/deploy.sh
# Application secrets come from Doppler, not this file.
# Images are built on GitHub Actions and pulled from GHCR.
set -Eeuo pipefail

APP_DIR='/opt/stacks/my_blog'
MEDIA_DIR='/opt/stacks/my_blog/media'
DOPPLER_PROJECT='my-blog'
DOPPLER_CONFIG='prd'
HEALTH_ATTEMPTS=15
HEALTH_SLEEP=4
LAST_GOOD_FILE="${APP_DIR}/.last-good-image-tag"
BACKEND_IMAGE='ghcr.io/kirillgorodetskiy/my-blog-backend'
FRONTEND_IMAGE='ghcr.io/kirillgorodetskiy/my-blog-frontend'
GHCR_REGISTRY='ghcr.io'
COMPOSE_FILES=(
    -f docker-compose.yml
    -f docker-compose.prod.yml
)

log() {
    printf '%s\n' "$*"
}

require_cmd() {
    command -v "$1" >/dev/null 2>&1 || {
        log "ERROR: missing command: $1"
        exit 1
    }
}

compose_doppler() {
    doppler run \
        --project "${DOPPLER_PROJECT}" \
        --config "${DOPPLER_CONFIG}" \
        -- docker compose "${COMPOSE_FILES[@]}" "$@"
}

print_diagnostics() {
    log '--- compose ps ---'
    (
        cd "${APP_DIR}"
        compose_doppler ps || docker compose "${COMPOSE_FILES[@]}" ps || true
    )
    log '--- backend logs ---'
    (
        cd "${APP_DIR}"
        compose_doppler logs --tail 80 --no-color backend || true
    )
    log '--- frontend logs ---'
    (
        cd "${APP_DIR}"
        compose_doppler logs --tail 80 --no-color frontend || true
    )
}

fail() {
    log "ERROR: $*"
    if [[ -d "${APP_DIR}" ]]; then
        print_diagnostics
    fi
    exit 1
}

wait_http() {
    local url="$1"
    local name="$2"
    local attempt=1
    local body
    local code

    while (( attempt <= HEALTH_ATTEMPTS )); do
        if body="$(
            curl --fail --silent --show-error \
                --max-time 5 \
                --write-out '\n%{http_code}' \
                "${url}"
        )"; then
            log "Health ok: ${name} (${url})"
            return 0
        fi
        code="${body##*$'\n'}"
        log "Waiting for ${name} (${attempt}/${HEALTH_ATTEMPTS}) http=${code:-none}"
        sleep "${HEALTH_SLEEP}"
        attempt=$((attempt + 1))
    done
    return 1
}

login_ghcr() {
    if [[ -z "${GHCR_TOKEN:-}" ]]; then
        log 'GHCR_TOKEN unset; pulling without login (public packages only)'
        return 0
    fi

    require_cmd docker
    log "Logging in to ${GHCR_REGISTRY}"
    printf '%s' "${GHCR_TOKEN}" | docker login \
        "${GHCR_REGISTRY}" \
        --username "${GHCR_USER:-kirillgorodetskiy}" \
        --password-stdin
}

running_image_tag() {
    local service="$1"
    local image

    image="$(
        compose_doppler ps --format '{{.Image}}' "${service}" \
            2>/dev/null | head -n 1 || true
    )"
    if [[ "${image}" == *:* ]]; then
        printf '%s\n' "${image##*:}"
    fi
}

read_previous_tag() {
    local from_file=''
    local from_running=''

    if [[ -f "${LAST_GOOD_FILE}" ]]; then
        from_file="$(tr -d '[:space:]' < "${LAST_GOOD_FILE}")"
    fi
    from_running="$(running_image_tag backend || true)"

    if [[ -n "${from_file}" ]]; then
        printf '%s\n' "${from_file}"
        return 0
    fi
    if [[ -n "${from_running}" ]]; then
        printf '%s\n' "${from_running}"
    fi
}

save_last_good() {
    umask 077
    printf '%s\n' "${IMAGE_TAG}" > "${LAST_GOOD_FILE}"
}

print_success() {
    log "deployed commit SHA: ${IMAGE_TAG}"
    log "backend image: ${BACKEND_IMAGE}:${IMAGE_TAG}"
    log "frontend image: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
    log 'container status:'
    compose_doppler ps
}

rollback_to() {
    local previous="$1"

    log "Attempting rollback to ${previous}"
    export IMAGE_TAG="${previous}"
    compose_doppler pull backend frontend
    compose_doppler up -d --no-build --remove-orphans \
        backend frontend
    if wait_http 'http://127.0.0.1:8000/healthz/' 'backend' \
        && wait_http 'http://127.0.0.1:3000/' 'frontend'; then
        log "Rollback healthy at ${previous}"
        save_last_good
        print_success
        return 0
    fi
    return 1
}

apply_images() {
    [[ -n "${IMAGE_TAG:-}" ]] || fail \
        'IMAGE_TAG is required (full Git commit SHA)'

    cd "${APP_DIR}"
    [[ -f docker-compose.yml ]] || fail 'docker-compose.yml not found'
    [[ -f docker-compose.prod.yml ]] || fail \
        'docker-compose.prod.yml not found'

    require_cmd docker
    require_cmd curl
    require_cmd doppler

    log "Applying image tag ${IMAGE_TAG}"
    mkdir -p "${MEDIA_DIR}"
    export MEDIA_HOST_PATH="${MEDIA_HOST_PATH:-${MEDIA_DIR}}"
    export IMAGE_TAG

    login_ghcr

    local previous=''
    previous="$(read_previous_tag || true)"
    if [[ -n "${previous}" ]]; then
        log "Previous known-good tag: ${previous}"
    else
        log 'No previous image tag recorded'
    fi

    log 'Pulling backend and frontend images from GHCR'
    compose_doppler pull backend frontend

    log 'Recreating backend and frontend (Postgres stays)'
    compose_doppler up -d --no-build --remove-orphans \
        backend frontend

    log 'Verifying health'
    if wait_http 'http://127.0.0.1:8000/healthz/' 'backend' \
        && wait_http 'http://127.0.0.1:3000/' 'frontend'; then
        save_last_good
        print_success
        log '=== deployment complete ==='
        return 0
    fi

    log 'ERROR: health check failed after image update'
    print_diagnostics

    if [[ -z "${previous}" || "${previous}" == "${IMAGE_TAG}" ]]; then
        fail 'Health failed and no different previous tag is available'
    fi

    if rollback_to "${previous}"; then
        fail "Deploy of ${IMAGE_TAG} failed; restored ${previous}"
    fi

    fail "Deploy of ${IMAGE_TAG} failed and rollback to ${previous} failed"
}

if [[ "${1:-}" == '--rollback' ]]; then
    require_cmd docker
    require_cmd curl
    require_cmd doppler
    cd "${APP_DIR}"
    export MEDIA_HOST_PATH="${MEDIA_HOST_PATH:-${MEDIA_DIR}}"
    IMAGE_TAG="${2:-}"
    if [[ -z "${IMAGE_TAG}" ]]; then
        IMAGE_TAG="$(read_previous_tag || true)"
    fi
    [[ -n "${IMAGE_TAG}" ]] || fail \
        'rollback needs IMAGE_TAG or .last-good-image-tag'
    login_ghcr
    rollback_to "${IMAGE_TAG}" || fail "rollback to ${IMAGE_TAG} failed"
    exit 0
fi

if [[ "${1:-}" != '--apply' ]]; then
    require_cmd git
    [[ -d "${APP_DIR}/.git" ]] || fail "git repo missing at ${APP_DIR}"

    cd "${APP_DIR}"
    log '=== deployment start ==='
    log "Updating repository in ${APP_DIR}"
    git fetch origin
    git checkout master
    git reset --hard origin/master
    log "Repository is now $(git rev-parse HEAD)"
    exec "${APP_DIR}/deploy/deploy.sh" --apply
fi

apply_images
# Migrations run once in backend/docker/entrypoint.sh.
# A failed migrate exits the backend container and fails health.
