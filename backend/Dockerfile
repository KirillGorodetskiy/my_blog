FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app/backend

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    'django>=5.2' \
    'gunicorn>=23.0.0' \
    'markdown>=3.9' \
    'psycopg2-binary>=2.9.10' \
    'python-dotenv>=1.1.0' \
    'whitenoise>=6.11.0'

COPY backend /app/backend
RUN chmod +x /app/backend/docker/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/backend/docker/entrypoint.sh"]
