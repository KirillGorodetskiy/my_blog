from backend.utils.config_check import check_required_env_vars


REQUIRED_ENV_VARS = (
    'DJANGO_SECRET_KEY',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_PORT',
)


def test_vars_present(monkeypatch):
    for var in REQUIRED_ENV_VARS:
        monkeypatch.setenv(var, 'dummy_value')
    check_required_env_vars(REQUIRED_ENV_VARS)


def test_vars_missing(monkeypatch):
    for var in REQUIRED_ENV_VARS[:-1]:
        monkeypatch.setenv(var, 'dummy_value')
    try:
        check_required_env_vars(REQUIRED_ENV_VARS)
    except Exception as e:
        assert 'Missing required environment variables' in str(e)
