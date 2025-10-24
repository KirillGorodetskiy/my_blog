from http import HTTPStatus

import pytest
from pytest_lazyfixture import lazy_fixture as lf
from django.contrib.auth import get_user_model

User = get_user_model()

pytestmark = pytest.mark.django_db

ADMIN_URL = lf('admin_url')

HOME_URL = lf('home_url')
POST_ADD_URL = lf('post_add_url')
POST_DETAIL_URL = lf('post_detail_url')
POST_EDIT_URL = lf('post_edit_url')
POST_DELETE_URL = lf('post_delete_url')

PROJECTS_URL = lf('projects_url')
PROJECT_ADD_URL = lf('project_add_url')
PROJECT_DETAIL_URL = lf('project_detail_url')
PROJECT_EDIT_URL = lf('project_edit_url')
PROJECT_DELETE_URL = lf('project_delete_url')

AVAILABILITY_CASES = (
    (HOME_URL, lf('superuser_client'), HTTPStatus.OK),
    (HOME_URL, lf('non_superuser_client'), HTTPStatus.OK),

    (POST_ADD_URL, lf('non_superuser_client'), HTTPStatus.FORBIDDEN),
    (POST_ADD_URL, lf('superuser_client'), HTTPStatus.OK),

    (POST_DETAIL_URL, lf('non_superuser_client'), HTTPStatus.OK),
    (POST_DETAIL_URL, lf('superuser_client'), HTTPStatus.OK),

    (POST_EDIT_URL, lf('non_superuser_client'), HTTPStatus.FORBIDDEN),
    (POST_EDIT_URL, lf('superuser_client'), HTTPStatus.OK),

    (POST_DELETE_URL, lf('non_superuser_client'), HTTPStatus.FORBIDDEN),
    (POST_DELETE_URL, lf('superuser_client'), HTTPStatus.OK),

    (PROJECTS_URL, lf('non_superuser_client'), HTTPStatus.OK),
    (PROJECTS_URL, lf('superuser_client'), HTTPStatus.OK),

    (PROJECT_ADD_URL, lf('non_superuser_client'), HTTPStatus.FORBIDDEN),
    (PROJECT_ADD_URL, lf('superuser_client'), HTTPStatus.OK),

    (PROJECT_DETAIL_URL, lf('non_superuser_client'), HTTPStatus.OK),
    (PROJECT_DETAIL_URL, lf('superuser_client'), HTTPStatus.OK),

    (PROJECT_EDIT_URL, lf('non_superuser_client'), HTTPStatus.FORBIDDEN),
    (PROJECT_EDIT_URL, lf('superuser_client'), HTTPStatus.OK),

    (PROJECT_DELETE_URL, lf('non_superuser_client'), HTTPStatus.FORBIDDEN),
    (PROJECT_DELETE_URL, lf('superuser_client'), HTTPStatus.OK),
)


@pytest.mark.parametrize(
    'url, test_client, expected_status',
    AVAILABILITY_CASES
)
def test_routes_status_codes(url, test_client, expected_status):
    resp = test_client.get(url)
    assert resp.status_code == expected_status
