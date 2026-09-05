FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq5 \
        libjpeg62-turbo \
        zlib1g \
        libpng16-16 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:0.9 /uv /usr/local/bin/uv

COPY pyproject.toml uv.lock /app/
RUN uv sync --frozen --no-dev --no-install-project

COPY backend /app/backend
RUN chmod +x /app/backend/docker/entrypoint.sh

WORKDIR /app/backend

EXPOSE 8000

ENTRYPOINT ["/app/backend/docker/entrypoint.sh"]
