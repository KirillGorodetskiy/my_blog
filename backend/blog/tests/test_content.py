from http import HTTPStatus

from django.conf import settings

import pytest

pytestmark = pytest.mark.django_db


def test_home_shows_established_num_of_posts(
        non_superuser_client,
        settings,
        post_list,
        home_url
):
    resp = non_superuser_client.get(home_url)
    assert resp.status_code == HTTPStatus.OK
    news_count = resp.context["object_list"].count()
    assert news_count == settings.POST_COUNT_ON_PAGE


def test_projects_shows_established_num_of_projects(
        non_superuser_client,
        settings,
        project_list,
        projects_url
):
    resp = non_superuser_client.get(projects_url)
    assert resp.status_code == HTTPStatus.OK
    news_count = resp.context["object_list"].count()
    assert news_count == settings.PROJECT_COUNT_ON_PAGE


# TODO non_superuser don`t see create/edit/delete post and project
# check sorting