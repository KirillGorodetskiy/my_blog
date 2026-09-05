from backend.utils.config_check import check_required_env_vars
from backend.settings import REQUIRED_ENV_VARS, TEST_ENV_VARS


def test_vars_present(monkeypatch):
    for var in REQUIRED_ENV_VARS:
        monkeypatch.setenv(var, 'dummy_value')
    check_required_env_vars(REQUIRED_ENV_VARS)


def test_production_does_not_require_test_db():
    assert all(
        not name.startswith('TEST_')
        for name in REQUIRED_ENV_VARS
    )
    assert TEST_ENV_VARS


def test_vars_missing(monkeypatch):
    for var in REQUIRED_ENV_VARS[:-1]:
        monkeypatch.setenv(var, 'dummy_value')
    try:
        check_required_env_vars(REQUIRED_ENV_VARS)
    except Exception as e:
        assert 'Missing required environment variables' in str(e)
