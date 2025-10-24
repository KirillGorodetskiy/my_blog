import pytest
from django.db import connection


pytestmark = pytest.mark.django_db


def test_which_db_user_is_used():
    db_name = connection.settings_dict['NAME']
    assert db_name == connection.settings_dict['TEST']['NAME']
