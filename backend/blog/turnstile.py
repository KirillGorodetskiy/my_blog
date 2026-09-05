import json
import urllib.error
import urllib.request

from django.conf import settings
from rest_framework.exceptions import ValidationError


VERIFY_URL = (
    'https://challenges.cloudflare.com/turnstile/v0/siteverify'
)


def _post_siteverify(payload: dict) -> dict:
    request = urllib.request.Request(
        VERIFY_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST',
    )
    try:
        with urllib.request.urlopen(request, timeout=8) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except (
        urllib.error.URLError,
        TimeoutError,
        json.JSONDecodeError,
        UnicodeError,
    ) as exc:
        raise ValidationError(
            {'turnstileToken': 'Turnstile verification failed.'},
        ) from exc


def verify_turnstile(
    token: str,
    *,
    post=_post_siteverify,
) -> None:
    value = (token or '').strip()
    if not value:
        raise ValidationError(
            {'turnstileToken': 'Turnstile token is required.'},
        )
    if settings.TURNSTILE_SKIP_VERIFY:
        return

    secret = settings.TURNSTILE_SECRET_KEY
    if not secret:
        raise ValidationError(
            {'turnstileToken': 'Turnstile is not configured.'},
        )

    result = post({'secret': secret, 'response': value})
    if not result.get('success'):
        raise ValidationError(
            {'turnstileToken': 'Turnstile token is invalid.'},
        )
