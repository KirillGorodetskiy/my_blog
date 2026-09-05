#!/bin/sh
set -eu

DUMP_DIR="${DUMP_DIR:-/dumps}"

if [ ! -d "$DUMP_DIR" ]; then
    echo "No dump directory at $DUMP_DIR; empty database."
    exit 0
fi

dump=$(
    find "$DUMP_DIR" -maxdepth 1 -type f \( \
        -name '*.sql' -o \
        -name '*.sql.gz' -o \
        -name '*.dump' -o \
        -name '*.backup' \
    \) | sort | head -n 1
)

if [ -z "$dump" ]; then
    echo "No SQL dump in $DUMP_DIR; Django will migrate."
    exit 0
fi

echo "Restoring $dump into $POSTGRES_DB"

case "$dump" in
    *.sql.gz)
        gunzip -c "$dump" | psql \
            -v ON_ERROR_STOP=1 \
            --username "$POSTGRES_USER" \
            --dbname "$POSTGRES_DB"
        ;;
    *.sql)
        psql \
            -v ON_ERROR_STOP=1 \
            --username "$POSTGRES_USER" \
            --dbname "$POSTGRES_DB" \
            -f "$dump"
        ;;
    *.dump|*.backup)
        pg_restore \
            --no-owner \
            --role="$POSTGRES_USER" \
            --username "$POSTGRES_USER" \
            --dbname "$POSTGRES_DB" \
            "$dump"
        ;;
esac
