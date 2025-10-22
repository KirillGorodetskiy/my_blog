import pytest
from django.db import connection

print(1)
pytestmark = pytest.mark.django_db
print(2)

def test_which_db_user_is_used():
    print(3)
    db_name = connection.settings_dict['NAME']
    print(db_name)
    assert db_name == connection.settings_dict['TEST']['NAME']
