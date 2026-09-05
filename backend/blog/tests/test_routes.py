from http import HTTPStatus

import pytest
from django.test import Client


pytestmark = pytest.mark.django_db


GONE_PATHS = (
    '/',
    '/post/1/',
    '/post/add/',
    '/projects/',
    '/projects/add/',
    '/accounts/login/',
)


def test_legacy_frontend_routes_are_gone():
    client = Client()
    for path in GONE_PATHS:
        response = client.get(path)
        assert response.status_code == HTTPStatus.NOT_FOUND


def test_healthz_returns_ok():
    response = Client().get('/healthz/')
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'status': 'ok'}


def test_admin_login_still_available():
    response = Client().get('/admin/login/')
    assert response.status_code == HTTPStatus.OK


def test_api_still_available():
    response = Client().get('/api/v1/auth/me/')
    assert response.status_code == HTTPStatus.OK
    assert response.json()['isAuthenticated'] is False
