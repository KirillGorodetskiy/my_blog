#!/usr/bin/env bash
# Template installed on the VPS as /opt/stacks/my_blog/deploy.sh
# Application secrets come from Doppler, not this file.
set -Eeuo pipefail

APP_DIR='/opt/stacks/my_blog'
MEDIA_DIR='/opt/stacks/my_blog/media'
DOPPLER_PROJECT='my-blog'
DOPPLER_CONFIG='prd'
HEALTH_ATTEMPTS=15
HEALTH_SLEEP=4

log() {
    printf '%s\n' "$*"
}

fail() {
    log "ERROR: $*"
    if [[ -d "${APP_DIR}" ]]; then
        (
            cd "${APP_DIR}"
            docker compose ps || true
        )
    fi
    exit 1
}

require_cmd() {
    command -v "$1" >/dev/null 2>&1 || fail "missing command: $1"
}

compose_doppler() {
    doppler run \
        --project "${DOPPLER_PROJECT}" \
        --config "${DOPPLER_CONFIG}" \
        -- docker compose "$@"
}

wait_http() {
    local url="$1"
    local name="$2"
    local attempt=1

    while (( attempt <= HEALTH_ATTEMPTS )); do
        if curl --fail --silent --show-error \
            --max-time 5 "${url}" >/dev/null; then
            log "Health ok: ${name} (${url})"
            return 0
        fi
        log "Waiting for ${name} (${attempt}/${HEALTH_ATTEMPTS})"
        sleep "${HEALTH_SLEEP}"
        attempt=$((attempt + 1))
    done
    fail "${name} did not become healthy: ${url}"
}

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

require_cmd git
require_cmd docker
require_cmd curl
require_cmd doppler

cd "${APP_DIR}"
[[ -f docker-compose.yml ]] || fail 'docker-compose.yml not found'

log "Applying commit $(git rev-parse HEAD)"
mkdir -p "${MEDIA_DIR}"
export MEDIA_HOST_PATH="${MEDIA_HOST_PATH:-${MEDIA_DIR}}"

log 'Building and starting containers via Doppler'
compose_doppler up -d --build --remove-orphans

log 'Verifying health'
wait_http 'http://127.0.0.1:8000/healthz/' 'backend'
wait_http 'http://127.0.0.1:3000/' 'frontend'

log 'Container status'
docker compose ps
log "Successful deployment of $(git rev-parse HEAD)"
log '=== deployment complete ==='
# Migrations run once in backend/docker/entrypoint.sh.
# A failed migrate exits the backend container and fails health.
