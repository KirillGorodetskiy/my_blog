from types import SimpleNamespace

from blog.proxy import client_ip


def test_client_ip_ignores_forwarded_without_proxy(settings):
    settings.BEHIND_PROXY = False
    request = SimpleNamespace(
        META={
            'REMOTE_ADDR': '10.0.0.8',
            'HTTP_X_FORWARDED_FOR': '1.2.3.4, 10.0.0.8',
        },
    )
    assert client_ip(request) == '10.0.0.8'


def test_client_ip_uses_nginx_forwarded_value(settings):
    settings.BEHIND_PROXY = True
    request = SimpleNamespace(
        META={
            'REMOTE_ADDR': '127.0.0.1',
            'HTTP_X_FORWARDED_FOR': '203.0.113.9',
        },
    )
    assert client_ip(request) == '203.0.113.9'
