import pytest
from django.contrib.auth import get_user_model
from django.test.client import Client


User = get_user_model()


@pytest.fixture
def non_superuser():
    return User.objects.create_user(
        username='I_user',
        email='us_user@lost.com',
        password='pass1dssAb',
    )


@pytest.fixture
def superuser():
    return User.objects.create_superuser(
        username='admin',
        email='admin@lost.com',
        password='pass1234Ab',
    )


@pytest.fixture
def non_superuser_client(non_superuser):
    client = Client()
    client.force_login(non_superuser)
    return client


@pytest.fixture
def superuser_client(superuser):
    client = Client()
    client.force_login(superuser)
    return client
