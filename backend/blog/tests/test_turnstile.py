import pytest
from rest_framework.exceptions import ValidationError

from blog.turnstile import verify_turnstile


def test_verify_turnstile_requires_token(settings):
    settings.TURNSTILE_SKIP_VERIFY = True
    with pytest.raises(ValidationError):
        verify_turnstile('')


def test_verify_turnstile_skip_does_not_call_network(settings):
    settings.TURNSTILE_SKIP_VERIFY = True

    def explode(_payload):
        raise AssertionError('network should not be used')

    verify_turnstile('test-ok', post=explode)


def test_verify_turnstile_rejects_invalid_token(settings):
    settings.TURNSTILE_SKIP_VERIFY = False
    settings.TURNSTILE_SECRET_KEY = 'secret'

    def fake_post(_payload):
        return {'success': False}

    with pytest.raises(ValidationError):
        verify_turnstile('bad-token', post=fake_post)


def test_verify_turnstile_accepts_valid_token(settings):
    settings.TURNSTILE_SKIP_VERIFY = False
    settings.TURNSTILE_SECRET_KEY = 'secret'

    def fake_post(payload):
        assert payload['secret'] == 'secret'
        assert payload['response'] == 'ok-token'
        return {'success': True}

    verify_turnstile('ok-token', post=fake_post)
