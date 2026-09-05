from backend.utils.env_lists import (
    hosts_from_env,
    origins_from_env,
    with_internal_hosts,
    with_local_origins,
)


def test_hosts_from_env_splits_and_strips():
    assert hosts_from_env(
        'localhost, gkablog.com, ',
        ['fallback'],
    ) == ['localhost', 'gkablog.com']


def test_hosts_from_env_uses_fallback():
    assert hosts_from_env(None, ['localhost']) == ['localhost']
    assert hosts_from_env('  ', ['localhost']) == ['localhost']


def test_with_internal_hosts_adds_docker_service():
    assert with_internal_hosts(
        ['localhost', 'gkablog.com'],
    ) == ['localhost', 'gkablog.com', 'backend']


def test_with_internal_hosts_does_not_duplicate():
    assert with_internal_hosts(['backend']) == ['backend']


def test_with_local_origins_adds_next_dev_ports():
    assert with_local_origins(
        ['https://gkablog.com'],
    ) == [
        'https://gkablog.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
    ]


def test_with_local_origins_does_not_duplicate():
    assert with_local_origins(
        ['http://localhost:3000'],
    ) == [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
    ]


def test_origins_from_env_splits():
    assert origins_from_env(
        'https://gkablog.com, http://localhost:3000',
        [],
    ) == [
        'https://gkablog.com',
        'http://localhost:3000',
    ]
