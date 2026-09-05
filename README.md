# my_blog
A Django backend and Next.js frontend for https://gkablog.com/

## Tech stack
- Python 3.13 / Django / PostgreSQL
- Next.js frontend
- Docker Compose for deploy

## Local development
```bash
git clone <REPO_URL> my_blog
cd my_blog
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Then open http://127.0.0.1:8000/ for Django, or `frontend/`
for the Next.js app.

## Deploy with Docker
Copy `.env.example` to `.env` and set real secrets.

Put the old database dump here before the first start:

`db/dumps/`

Supported files:
- `*.sql` or `*.sql.gz` — `psql`
- `*.dump` or `*.backup` — `pg_restore`
- `*.json` — Django `loaddata` (set `LOAD_DJANGO_FIXTURES=1`)

Postgres reads that folder only on the first empty volume.
If you already started Postgres once, remove the volume
before importing:

```bash
docker compose down -v
docker compose up --build
```

After it is up:
- Frontend: http://localhost:3000
- Django admin: http://localhost:8000/admin/

## Usage
Place Django templates in the app `templates/` folder.
Put CSS/JS/images in `static/`.
Define views in `views.py` and map them in `urls.py`.
