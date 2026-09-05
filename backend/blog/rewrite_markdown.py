from blog.models import Post, Project

ARTICLE_BODY = """## Hi, I'm Kirill

I've decided to dive into the world of programming — and this website is my space to share that journey. Here, I'll document what I'm learning, what I'm building, and everything that comes in between.

I didn't start out in tech, but I'm here with curiosity, persistence, and a real excitement for how much there is to explore.

You'll find projects here — some polished, some still taking shape — all made with purpose. I'll also share notes, reflections, and lessons from the process.

This isn't about perfection. It's about showing up, building things, and enjoying the ride.

Thanks for stopping by — let's see where this adventure goes!

— Kirill

[Kirill Gorodetskiy on GitHub](https://github.com/KirillGorodetskiy)
"""

ARTICLE_EXCERPT = (
    'Notes from the start of my programming journey, '
    'and the work I am building along the way.'
)

TESTING_BODY = """## Why Pytest

Testing keeps Django code reliable and stops regressions
when you change it. **Pytest** is a clear, powerful test
runner for Python. With **pytest-django** it fits Django
projects well.

### Why it helps

- Simple syntax: tests use plain `assert` statements
- Powerful fixtures: reusable setup and teardown
- Plugins: Django integration, coverage, and more
- Detailed output: clear failures and stack traces

## Setup in a Django project

Install the packages:

```bash
pip install pytest pytest-django
```

Create `pytest.ini` in the project root:

```ini
[pytest]
DJANGO_SETTINGS_MODULE = myproject.settings
python_files = tests.py test_*.py *_tests.py
```

Run the suite:

```bash
pytest
```

## Writing tests

Pytest works with Django's test layout, with less
boilerplate. A simple model test:

```python
import pytest
from myapp.models import Product


@pytest.mark.django_db
def test_product_str():
    product = Product.objects.create(
        name='Laptop',
        price=1000,
    )
    assert str(product) == 'Laptop'
```

## Testing views

Use Django's test client:

```python
import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_homepage(client):
    url = reverse('home')
    response = client.get(url)
    assert response.status_code == 200
    assert 'Welcome' in response.content.decode()
```

## Useful features

- ⚙️ `@pytest.mark.django_db` — database access in a test
- 🔧 `client` — built-in Django test-client fixture
- 🚀 `pytest --reuse-db` — reuse the test database
- 🔍 `pytest -k "keyword"` — run tests that match a keyword

## Conclusion

Pytest makes Django tests easier to write and faster to
run. It works with Django's testing tools and covers
models, views, and APIs.
"""

TESTING_EXCERPT = (
    'How I use Pytest with Django: setup, fixtures, '
    'the test client, and useful flags.'
)

PROJECTS = {
    'fast-api-telegram-bot': """
A streamlined backend and Telegram bot that lets admins and staff define and manage AI-driven conversations in real time. It combines a React UI, a FastAPI REST API, and a Telegram bot, using the OpenAI API to generate replies.

### What you can do

- Configure system prompts and GPT models in the UI
- View and manage conversations between customers and the bot
- Assign admin and staff roles for secure access
- Deploy the stack in a single Docker container with SQLite

This is a hands-on FastAPI learning project. It covers JWT authentication, environment-based configuration, and role-based access control.
""".strip(),
    'telegram-bot': """
A backend-focused Telegram bot built while studying Python backend development.

The project integrates with the Telegram Bot API and demonstrates API communication, configuration management, response validation, and modular application structure.

### Key features

- Send and receive messages through the Telegram Bot API
- Store secrets and configuration in environment variables
- Validate responses from external APIs
- Modular structure designed for extension and maintenance

### Tech stack

`Python` · `python-telegram-bot` · `dotenv` · `Telegram Bot API`
""".strip(),
    'testing': """
A dedicated backend-course project focused on testing with Pytest and Unittest. The course reviewer accepted all code in this repository.

### Key focus

- Writing and organising test cases for Django applications
- Using both Pytest and Unittest
- Meeting review standards and passing acceptance criteria

### What you will find

- Test modules covering models, views, and serializers
- Examples of setup, fixtures, mocks, and assertions
- Tests wired into the workflow for automation and quality control
""".strip(),
    'django-learning-projects': """
A set of backend-course projects with live code review, covering Django from first setup to a fuller backend.

- [django-sprint1](https://github.com/KirillGorodetskiy/django-sprint1) — foundational Django tasks and setup
- [django-sprint3](https://github.com/KirillGorodetskiy/django-sprint3) — intermediate views and templates
- [django-sprint4](https://github.com/KirillGorodetskiy/django-sprint4) — REST API, authentication, and deployment

Each project shows the next step, from basics to full-stack backend work.
""".strip(),
    'api-yatube': """
A full backend REST API from a backend development course. It manages posts, groups, and comments for a social-network-style service with no frontend. It includes JWT authentication, role-based permissions, filtering, pagination, and search.

I built the project alone, from design through implementation.

### Key features

- User signup and JWT authentication
- CRUD endpoints for posts, groups, and comments
- Filtering, search, and pagination
- OpenAPI / YAML documentation
- GitHub workflow and Pytest coverage
""".strip(),
    'yamdb': """
A small backend application from a backend development course. It exposes a REST API with no frontend: email confirmation signup, JWT authentication, and CRUD for titles, genres, categories, reviews, and comments.

I was team lead in a three-person group. I owned deadlines, review acceptance, and the GitHub workflow (branches, pull requests, and cross-review).

### Key features

- Signup, email confirmation code, then JWT
- Role-based permissions for user, moderator, and admin
- Endpoints documented in OpenAPI / YAML
- Active GitHub collaboration and code review
""".strip(),
    'telegram-cash-exchange-statistics-bot': """
This Telegram bot shows current buy and sell cash exchange rates for a city you choose. Rates come from [cash.rbc.ru](https://cash.rbc.ru).

> ⚠️ Always confirm the actual rates with the bank before you visit. Displayed values can differ.

### About the project

This bot was built as an educational example. It shows how to:

- Work with the Telegram Bot API
- Fetch and display live data from external APIs
- Cache responses in Redis
- Store user data and settings in PostgreSQL
- Run the services in Docker

### Features

- 💰 Up-to-date cash exchange rates for Moscow and Saint Petersburg
- 🌐 Live data from [cash.rbc.ru](https://cash.rbc.ru)
- 🪙 Crypto-to-fiat prices alongside cash rates
- 🧠 Educational walkthrough of Telegram, live APIs, Redis, PostgreSQL, and Docker

### Tech stack

`Python` · `Telegram Bot API` · `Redis` · `PostgreSQL` · `Docker`
""".strip(),
    'travel-history-tracker': """
Visa applications (UK, Schengen, US, and others) often need a precise travel history. Many people never keep those records in one place. This app stores trips in a structured way and exports them when you need them.

### Why it exists

It is also a personal project for practising Python, software architecture, and product design. An older Streamlit version is live. A fuller version is in progress, built as a faster modern iteration.

### Current status

- Old Streamlit version: live and usable
- Next version: stronger backend, better export options, and a clearer interface
""".strip(),
    'my-blog-website': """
This is my personal blog, started as a study project to improve my backend skills. I built the backend in Django. The site is live and I keep improving it.

> Status: actively developed.

### About the project

The aim is to practise modern Django: posts, authentication, and structured storage.

### Tech stack

`Django` · `PostgreSQL` · `Pytest` · `HTML` · `CSS` · `JavaScript`

### What I practise

- Designing a Django backend from scratch
- Using the ORM with PostgreSQL
- Writing and running Pytest tests
- Deploying and maintaining a live app
- Running apps on a VPS over SSH, with domains and Nginx

### Status

- ✅ Live version: online and working
- ⚙️ Development: ongoing features, structure, and performance
""".strip(),
    'the-snake-game': (
        'A Snake game from my Yandex Python course.'
    ),
}


def run() -> None:
    article = Post.objects.get(
        slug='welcome-my-journey-into-programming',
    )
    article.body = ARTICLE_BODY
    article.excerpt = ARTICLE_EXCERPT
    article.save(update_fields=['body', 'excerpt'])
    print(f'updated article {article.slug}')

    testing = Post.objects.get(slug='testing-strategies')
    testing.body = TESTING_BODY
    testing.excerpt = TESTING_EXCERPT
    testing.save(update_fields=['body', 'excerpt'])
    print(f'updated article {testing.slug}')

    for slug, description in PROJECTS.items():
        project = Project.objects.get(slug=slug)
        project.description = description
        project.save(update_fields=['description'])
        print(f'updated project {slug}')


if __name__ == '__main__':
    run()
