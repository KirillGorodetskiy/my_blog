#!/bin/sh
set -eu

python - <<'PY'
import os
import socket
import time

host = os.environ['DB_HOST']
port = int(os.environ['DB_PORT'])
deadline = time.monotonic() + 60

while True:
    try:
        with socket.create_connection((host, port), timeout=2):
            break
    except OSError:
        if time.monotonic() >= deadline:
            raise SystemExit(f'{host}:{port} did not become ready')
        time.sleep(1)
PY

python manage.py migrate --noinput
python manage.py collectstatic --noinput

DUMP_DIR="${DUMP_DIR:-/dumps}"
if [ "${LOAD_DJANGO_FIXTURES:-0}" = "1" ] && [ -d "$DUMP_DIR" ]; then
    for fixture in "$DUMP_DIR"/*.json; do
        if [ -f "$fixture" ]; then
            python manage.py loaddata "$fixture"
        fi
    done
fi

exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers "${GUNICORN_WORKERS:-3}" \
    --access-logfile - \
    --error-logfile -
