from backend.utils.env_lists import hosts_from_env, origins_from_env


def test_hosts_from_env_splits_and_strips():
    assert hosts_from_env(
        'localhost, gkablog.com, ',
        ['fallback'],
    ) == ['localhost', 'gkablog.com']


def test_hosts_from_env_uses_fallback():
    assert hosts_from_env(None, ['localhost']) == ['localhost']
    assert hosts_from_env('  ', ['localhost']) == ['localhost']


def test_origins_from_env_splits():
    assert origins_from_env(
        'https://gkablog.com, http://localhost:3000',
        [],
    ) == [
        'https://gkablog.com',
        'http://localhost:3000',
    ]
