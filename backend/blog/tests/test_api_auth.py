from http import HTTPStatus

import pytest
from django.contrib.auth import get_user_model
from django.test import Client
from rest_framework.test import APIClient


User = get_user_model()
pytestmark = pytest.mark.django_db


def register_payload(**overrides):
    data = {
        'username': 'reader',
        'email': 'reader@example.com',
        'password': 'SafePass123!',
        'passwordConfirm': 'SafePass123!',
        'turnstileToken': 'test-ok',
    }
    data.update(overrides)
    return data


class CsrfAPIClient(APIClient):
    def generic(self, method, path, *args, **kwargs):
        token = self.cookies.get('csrftoken')
        if token is not None:
            kwargs.setdefault('HTTP_X_CSRFTOKEN', token.value)
        return super().generic(method, path, *args, **kwargs)


def csrf_api():
    client = CsrfAPIClient(enforce_csrf_checks=True)
    client.get('/api/v1/auth/me/')
    return client


@pytest.fixture
def api():
    return csrf_api()


def test_me_anonymous_and_sets_csrf(api):
    response = api.get('/api/v1/auth/me/')
    assert response.status_code == HTTPStatus.OK
    payload = response.json()
    assert payload['isAuthenticated'] is False
    assert payload['isStaff'] is False
    assert payload['isSuperuser'] is False
    assert 'csrftoken' in response.cookies


def test_auth_paths_work_without_trailing_slash(api):
    me = api.get('/api/v1/auth/me')
    assert me.status_code == HTTPStatus.OK
    assert 'csrftoken' in me.cookies

    created = api.post(
        '/api/v1/auth/register',
        register_payload(
            username='slashuser',
            email='slash@example.com',
        ),
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


def test_login_csrf_succeeds_with_valid_token():
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
    assert response.json()['isStaff'] is False


def test_login_csrf_rejected_without_token():
    User.objects.create_user(
        username='nocsrf',
        email='nocsrf@example.com',
        password='SafePass123!',
    )
    client = Client(enforce_csrf_checks=True)
    client.get('/api/v1/auth/me/')
    response = client.post(
        '/api/v1/auth/login/',
        data=(
            '{"username":"nocsrf",'
            '"password":"SafePass123!"}'
        ),
        content_type='application/json',
    )
    assert response.status_code == HTTPStatus.FORBIDDEN


def test_register_csrf_succeeds_with_valid_token():
    client = Client(enforce_csrf_checks=True)
    client.get('/api/v1/auth/me/')
    token = client.cookies['csrftoken'].value
    response = client.post(
        '/api/v1/auth/register/',
        data=(
            '{"username":"csrfok",'
            '"email":"csrfok@example.com",'
            '"password":"SafePass123!",'
            '"passwordConfirm":"SafePass123!",'
            '"turnstileToken":"test-ok"}'
        ),
        content_type='application/json',
        HTTP_X_CSRFTOKEN=token,
        HTTP_ORIGIN='http://localhost:3001',
    )
    assert response.status_code == HTTPStatus.CREATED


def test_register_csrf_rejected_without_token():
    client = Client(enforce_csrf_checks=True)
    client.get('/api/v1/auth/me/')
    response = client.post(
        '/api/v1/auth/register/',
        data=(
            '{"username":"csrfbad",'
            '"email":"csrfbad@example.com",'
            '"password":"SafePass123!",'
            '"passwordConfirm":"SafePass123!",'
            '"turnstileToken":"test-ok"}'
        ),
        content_type='application/json',
    )
    assert response.status_code == HTTPStatus.FORBIDDEN


def test_register_creates_normal_non_staff_user(api):
    created = api.post(
        '/api/v1/auth/register/',
        register_payload(),
        format='json',
    )
    assert created.status_code == HTTPStatus.CREATED
    payload = created.json()
    assert payload['username'] == 'reader'
    assert payload['isStaff'] is False
    assert payload['isSuperuser'] is False
    assert 'password' not in payload

    user = User.objects.get(username='reader')
    assert user.is_staff is False
    assert user.is_superuser is False


def test_register_login_logout_roundtrip(api):
    created = api.post(
        '/api/v1/auth/register/',
        register_payload(),
        format='json',
    )
    assert created.status_code == HTTPStatus.CREATED

    me = api.get('/api/v1/auth/me/')
    assert me.json()['isAuthenticated'] is True
    assert me.json()['isStaff'] is False

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


def test_staff_me_reports_staff_flags(api):
    user = User.objects.create_user(
        username='editor',
        email='editor@example.com',
        password='SafePass123!',
    )
    user.is_staff = True
    user.save(update_fields=['is_staff'])
    api.force_login(user)
    payload = api.get('/api/v1/auth/me/').json()
    assert payload['isAuthenticated'] is True
    assert payload['isStaff'] is True
    assert payload['isSuperuser'] is False


def test_register_rejects_duplicate_and_weak_password(api):
    User.objects.create_user(
        username='taken',
        email='taken@example.com',
        password='SafePass123!',
    )
    duplicate = api.post(
        '/api/v1/auth/register/',
        register_payload(
            username='taken',
            email='other@example.com',
        ),
        format='json',
    )
    assert duplicate.status_code == HTTPStatus.BAD_REQUEST

    weak = api.post(
        '/api/v1/auth/register/',
        register_payload(
            username='fresh',
            email='fresh@example.com',
            password='123',
            passwordConfirm='123',
        ),
        format='json',
    )
    assert weak.status_code == HTTPStatus.BAD_REQUEST


def test_register_validates_locally_before_turnstile(
    api,
    monkeypatch,
):
    calls = []

    def fake_verify(token, post=None):
        calls.append(token)

    monkeypatch.setattr(
        'blog.turnstile.verify_turnstile',
        fake_verify,
    )
    mismatch = api.post(
        '/api/v1/auth/register/',
        register_payload(
            username='fresh',
            email='fresh@example.com',
            password='SafePass123!',
            passwordConfirm='Different123!',
            turnstileToken='used-once',
        ),
        format='json',
    )
    assert mismatch.status_code == HTTPStatus.BAD_REQUEST
    assert calls == []

    weak = api.post(
        '/api/v1/auth/register/',
        register_payload(
            username='fresh',
            email='fresh@example.com',
            password='123',
            passwordConfirm='123',
            turnstileToken='used-once',
        ),
        format='json',
    )
    assert weak.status_code == HTTPStatus.BAD_REQUEST
    assert calls == []

    created = api.post(
        '/api/v1/auth/register/',
        register_payload(
            username='fresh',
            email='fresh@example.com',
            turnstileToken='used-once',
        ),
        format='json',
    )
    assert created.status_code == HTTPStatus.CREATED
    assert calls == ['used-once']


def test_register_rejects_missing_turnstile(api):
    response = api.post(
        '/api/v1/auth/register/',
        register_payload(turnstileToken=''),
        format='json',
    )
    assert response.status_code == HTTPStatus.BAD_REQUEST


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
