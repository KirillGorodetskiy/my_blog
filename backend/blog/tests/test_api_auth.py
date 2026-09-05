from http import HTTPStatus

import pytest
from django.contrib.auth import get_user_model
from django.test import Client
from rest_framework.test import APIClient


User = get_user_model()
pytestmark = pytest.mark.django_db


@pytest.fixture
def api():
    return APIClient()


def test_me_anonymous_and_sets_csrf(api):
    response = api.get('/api/v1/auth/me/')
    assert response.status_code == HTTPStatus.OK
    assert response.json()['isAuthenticated'] is False
    assert 'csrftoken' in response.cookies


def test_auth_paths_work_without_trailing_slash(api):
    me = api.get('/api/v1/auth/me')
    assert me.status_code == HTTPStatus.OK
    assert 'csrftoken' in me.cookies

    created = api.post(
        '/api/v1/auth/register',
        {
            'username': 'slashuser',
            'email': 'slash@example.com',
            'password': 'SafePass123!',
            'passwordConfirm': 'SafePass123!',
        },
        format='json',
    )
    assert created.status_code == HTTPStatus.CREATED

    api.post('/api/v1/auth/logout')
    login = api.post(
        '/api/v1/auth/login',
        {
            'username': 'slashuser',
            'password': 'SafePass123!',
        },
        format='json',
    )
    assert login.status_code == HTTPStatus.OK


def test_login_csrf_allows_local_next_origin():
    User.objects.create_user(
        username='localnext',
        email='localnext@example.com',
        password='SafePass123!',
    )
    client = Client(enforce_csrf_checks=True)
    client.get('/api/v1/auth/me')
    token = client.cookies['csrftoken'].value
    response = client.post(
        '/api/v1/auth/login',
        data=(
            '{"username":"localnext",'
            '"password":"SafePass123!"}'
        ),
        content_type='application/json',
        HTTP_X_CSRFTOKEN=token,
        HTTP_ORIGIN='http://localhost:3001',
    )
    assert response.status_code == HTTPStatus.OK


def test_register_login_logout_roundtrip(api):
    created = api.post(
        '/api/v1/auth/register/',
        {
            'username': 'reader',
            'email': 'reader@example.com',
            'password': 'SafePass123!',
            'passwordConfirm': 'SafePass123!',
        },
        format='json',
    )
    assert created.status_code == HTTPStatus.CREATED
    assert created.json()['username'] == 'reader'
    assert 'password' not in created.json()

    me = api.get('/api/v1/auth/me/')
    assert me.json()['isAuthenticated'] is True

    api.post('/api/v1/auth/logout/')
    assert api.get('/api/v1/auth/me/').json()[
        'isAuthenticated'
    ] is False

    login = api.post(
        '/api/v1/auth/login/',
        {
            'username': 'reader',
            'password': 'SafePass123!',
        },
        format='json',
    )
    assert login.status_code == HTTPStatus.OK
    assert api.get('/api/v1/auth/me/').json()[
        'isAuthenticated'
    ] is True


def test_register_rejects_duplicate_and_weak_password(api):
    User.objects.create_user(
        username='taken',
        email='taken@example.com',
        password='SafePass123!',
    )
    duplicate = api.post(
        '/api/v1/auth/register/',
        {
            'username': 'taken',
            'email': 'other@example.com',
            'password': 'SafePass123!',
            'passwordConfirm': 'SafePass123!',
        },
        format='json',
    )
    assert duplicate.status_code == HTTPStatus.BAD_REQUEST

    weak = api.post(
        '/api/v1/auth/register/',
        {
            'username': 'fresh',
            'email': 'fresh@example.com',
            'password': '123',
            'passwordConfirm': '123',
        },
        format='json',
    )
    assert weak.status_code == HTTPStatus.BAD_REQUEST


def test_csrf_required_for_authenticated_post():
    user = User.objects.create_user(
        username='guard',
        email='guard@example.com',
        password='SafePass123!',
    )
    client = Client(enforce_csrf_checks=True)
    client.force_login(user)
    blocked = client.post('/api/v1/auth/logout/')
    assert blocked.status_code == HTTPStatus.FORBIDDEN

    client.get('/api/v1/auth/me/')
    token = client.cookies['csrftoken'].value
    allowed = client.post(
        '/api/v1/auth/logout/',
        HTTP_X_CSRFTOKEN=token,
    )
    assert allowed.status_code == HTTPStatus.NO_CONTENT


def test_admin_rejects_non_staff(non_superuser_client):
    response = non_superuser_client.get('/admin/')
    assert response.status_code == HTTPStatus.FOUND
    assert '/admin/login/' in response['Location']


def test_admin_allows_superuser(superuser_client):
    response = superuser_client.get('/admin/')
    assert response.status_code == HTTPStatus.OK
