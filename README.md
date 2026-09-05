# my_blog

Personal site at https://gkablog.com/

Next.js is the public frontend. Django is the REST API
and Admin CMS. PostgreSQL stores the data. Host Nginx
terminates TLS and routes traffic.

## Architecture

```text
Internet
  ↓
Host Nginx :80/:443
  ├── /              → Next.js
  ├── /api/          → Django REST API
  ├── /admin/        → Django Admin
  ├── /static/       → Django / WhiteNoise
  └── /media/        → host files (not Django)

Next.js = public frontend
Django REST API = backend
Django Admin = CMS / moderation
PostgreSQL = persistent data
```

Do not expose backend, frontend, or Postgres on
`0.0.0.0`. Compose binds app ports to localhost only.

## Local development

Requires Python 3.13, [uv](https://docs.astral.sh/uv/),
Node.js, and PostgreSQL (or Docker Compose).

```bash
git clone <REPO_URL> my_blog
cd my_blog
cp .env.example .env
```

### Backend

```bash
uv sync
cd backend
uv run python manage.py migrate
uv run python manage.py runserver
```

Runtime dependencies live in `pyproject.toml`.
Development and test tools are in the `dev` group and
are installed by `uv sync`. The lock file is `uv.lock`.

There is no `requirements.txt`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Local URLs

| URL | Role |
| --- | --- |
| http://localhost:3000/ | Next.js public site |
| http://localhost:8000/admin/ | Django Admin |
| http://localhost:8000/api/v1/... | REST API |
| http://localhost:8000/healthz/ | health check |
| http://localhost:8000/ | intentionally 404 |

The public site is Next.js, not Django templates.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

Images do not mount application source. Rebuild after
backend or frontend code changes:

```bash
docker compose up -d --build
```

Compose interpolates `${VAR}` from the process
environment. Locally that is the project `.env` file.
`docker compose restart` does not reload `.env`.

Compose ports:

- frontend: `127.0.0.1:3000`
- backend: `127.0.0.1:8000`
- Postgres: no host port

## Database restore

Put a dump in `db/dumps/` before the first Postgres
start. That folder is read only when the volume is
empty.

Supported dump types:

- `*.sql` or `*.sql.gz` — `psql`
- `*.dump` or `*.backup` — `pg_restore`
- `*.json` — Django `loaddata` (set
  `LOAD_DJANGO_FIXTURES=1`)

### Critical: do not wipe media

`docker compose down -v` deletes **every** Compose
volume, including the PostgreSQL data volume. Do not
use it as a routine reset.

If you only need to discard the database and import a
dump again, remove the Postgres volume only:

```bash
# DESTRUCTIVE: deletes PostgreSQL data only.
docker compose stop postgres
docker volume rm my_blog_postgres_data
docker compose up -d
```

Confirm the volume name with `docker volume ls`.

Media lives on a host bind mount
(`${MEDIA_HOST_PATH:-./backend/media}`), not in that
Postgres volume. A database-only reset does not delete
uploads. `docker compose down -v` is still dangerous if
any other named volumes exist.

## Media

Production layout:

```text
host:      /opt/stacks/my_blog/media/
container: /app/backend/media
```

Host Nginx serves `/media/` from the host path. Django
must not serve media in production
(`DJANGO_DEBUG=0`, `DJANGO_SERVE_MEDIA=0`).

Local development may set `DJANGO_SERVE_MEDIA=1` so
Django can serve uploads without host Nginx.

Back up the host media directory on the same schedule
as PostgreSQL. A database dump without the media files
is not a complete restore.

## Tests

Backend (from `backend/`):

```bash
uv run pytest
uv run python manage.py makemigrations --check --dry-run
uv run python manage.py migrate --plan
```

**Take a PostgreSQL backup before applying new
migrations in production.**

Frontend (from `frontend/`):

```bash
npm test
npm run lint
npm run build
```

## Deployment

Host Nginx proxies `/` to Next.js on `127.0.0.1:3000`
and `/api/`, `/admin/`, and `/static/` to Django on
`127.0.0.1:8000`. `/media/` is a filesystem alias, not
a proxy.

See `deploy/nginx-gkablog.conf.example`.

Required production environment:

```text
DJANGO_DEBUG=0
DJANGO_BEHIND_PROXY=1
DJANGO_SECURE_COOKIES=1
DJANGO_SERVE_MEDIA=0
TURNSTILE_SKIP_VERIFY=0
TURNSTILE_SECRET_KEY=...
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
MEDIA_HOST_PATH=/opt/stacks/my_blog/media
```

With those flags Django sets:

```text
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = Lax
SESSION_COOKIE_SAMESITE = Lax
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
```

Auth stays same-origin session cookies. Do not add
CORS, JWT, or Redis for this stack.

Nginx must set trusted proxy headers from the real
client, not from incoming `X-Forwarded-For`:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;
```

## Production deployment

GitHub Actions runs CI on `master`, then SSHes to the VPS
and runs `/opt/stacks/my_blog/deploy.sh`. Doppler on the
VPS injects `my-blog` / `prd` into Docker Compose.
Host Nginx is not reloaded by application deploys.

```text
push/merge to master
  → backend + frontend CI
  → SSH
  → deploy.sh
  → git reset --hard origin/master
  → doppler run -- docker compose up -d --build
  → health checks
```

Migrations run **once** in
`backend/docker/entrypoint.sh` when the backend
container starts. The deploy script does not run
`migrate` again. A failed migrate exits the container
and fails health verification. Take a PostgreSQL backup
before the first production deploy of new migrations.

Do not run `docker compose down` or `docker compose down
-v` during ordinary deploys.

### One-time VPS setup

```bash
# 1. Clone to the production path (public HTTPS clone).
sudo mkdir -p /opt/stacks/my_blog
sudo chown "$USER":"$USER" /opt/stacks/my_blog
git clone https://github.com/KirillGorodetskiy/my_blog.git \
  /opt/stacks/my_blog
cd /opt/stacks/my_blog
git checkout master

# If the GitHub repo is private, do not reuse the
# GitHub Actions SSH key. Create a separate VPS deploy
# key, add it as a GitHub Deploy Key (read-only), and
# clone with git@github.com:KirillGorodetskiy/my_blog.git

# 2. Install Docker Engine and Compose.
# 3. Allow the deploy user to run docker (no 777).
sudo usermod -aG docker "$USER"

# 4. Install Doppler CLI, then authenticate on the VPS
#    only. A Doppler service token for my-blog/prd is
#    the unattended option:
#      doppler configure set token --token '<token>' \
#        --scope /opt/stacks/my_blog
#    Do not put that token in GitHub or this repo.
doppler setup --project my-blog --config prd

# 5. Media directory. Docker writes uploads here.
#    Host Nginx reads them. Typical mode is 755.
mkdir -p /opt/stacks/my_blog/media

# 6. Install the deploy entrypoint.
install -m 750 deploy/deploy.sh /opt/stacks/my_blog/deploy.sh

# 7. Configure host Nginx from
#    deploy/nginx-gkablog.conf.example
#    frontend 127.0.0.1:3000, backend 127.0.0.1:8000,
#    /media/ aliased to /opt/stacks/my_blog/media/
```

Doppler `prd` must include the production values
documented above, especially:

```text
DJANGO_DEBUG=0
DJANGO_BEHIND_PROXY=1
DJANGO_SECURE_COOKIES=1
DJANGO_SERVE_MEDIA=0
TURNSTILE_SKIP_VERIFY=0
MEDIA_HOST_PATH=/opt/stacks/my_blog/media
```

plus Django/Postgres/Turnstile secrets. Compose reads
those from the `doppler run` environment. There is no
production `.env` file.

### One-time GitHub setup

Create a GitHub Environment named `production` with
these secrets only:

```text
VPS_HOST
VPS_USER
VPS_SSH_PRIVATE_KEY
VPS_SSH_PORT
```

`VPS_SSH_PORT` may be `22`. Application secrets do not
belong here.

Recreate the Actions → VPS key locally (do not commit):

```bash
ssh-keygen -t ed25519 -C "github-actions-my-blog" \
  -f github-actions-my-blog
```

```text
github-actions-my-blog
    private key
    → GitHub Environment secret VPS_SSH_PRIVATE_KEY
    Must be usable non-interactively (no passphrase,
    or an agent the runner cannot use).

github-actions-my-blog.pub
    public key
    → deploy user's ~/.ssh/authorized_keys on the VPS
```

On the VPS, as the deploy user:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
# paste the public key, one line
cat >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

This key is only for GitHub Actions → VPS SSH. Keep
VPS → GitHub repository credentials separate.

### Normal deployment

Merge or push to `master`, or run the **Deploy**
workflow manually on `master`. CI must pass before SSH
deploy.

### Deploy script path

```text
repo:   deploy/deploy.sh
VPS:    /opt/stacks/my_blog/deploy.sh
```

The VPS script updates git, then execs
`deploy/deploy.sh --apply` from the checked-out commit.

## Markdown images

Admin-authored Markdown should use uploaded files under
`/media/`. `http`/`https` URLs render as a plain
`<img>`. `javascript:` and `data:` URLs are rejected.
