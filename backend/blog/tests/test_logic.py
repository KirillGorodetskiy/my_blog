from http import HTTPStatus

import pytest
from pytest_django.asserts import assertRedirects
from pytest_lazyfixture import lazy_fixture as lf
from django.contrib.auth import get_user_model
from django.urls import reverse, NoReverseMatch

from blog.models import Project, Post

User = get_user_model()

pytestmark = pytest.mark.django_db

NEW_POST_PAYLOAD = {
    'title': 'MyUniqueTittlle',
    'body': 'text text text'
}

NEW_PROJECT_PAYLOAD = {
    'title': 'MyUniqueProject',
    'description': 'text text text'
}

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

NON_SAFE_METHODS_CASES_FOR_NON_SUPER_USER = (
    (POST_ADD_URL, NEW_POST_PAYLOAD, HTTPStatus.FORBIDDEN),
    (POST_EDIT_URL, NEW_POST_PAYLOAD, HTTPStatus.FORBIDDEN),

    (PROJECT_EDIT_URL, NEW_PROJECT_PAYLOAD, HTTPStatus.FORBIDDEN),
    (PROJECT_ADD_URL, NEW_PROJECT_PAYLOAD, HTTPStatus.FORBIDDEN),
)


def get_unsafe_methods_names(model_names: tuple) -> tuple:
    '''returns names create_model update_model delete_model'''
    suffixes = ('add', 'delete', 'edit')
    result = [
        f'{model_name}_{suffix}'
        for model_name in model_names
        for suffix in suffixes
    ]
    return tuple(result)


def get_reverse_urls_with_pk(name: str, models_name: tuple, objs):
    model_name = [m_name for m_name in models_name if m_name in name][0]
    try:
        return reverse(name, kwargs={'pk': objs[model_name].pk})
    except NoReverseMatch:
        return reverse(name)


def test_superuser_can_add_new_post(
    superuser_client,
    post_add_url,
    home_url
):
    count_before = Post.objects.count()
    resp = superuser_client.post(post_add_url, NEW_POST_PAYLOAD)
    expected = home_url
    assertRedirects(resp, expected)
    assert Post.objects.count() == count_before + 1
    post = Post.objects.latest("id")
    assert post.title == NEW_POST_PAYLOAD["title"]
    assert post.body == NEW_POST_PAYLOAD["body"]


@pytest.mark.parametrize(
    'url, payload, expected_status',
    NON_SAFE_METHODS_CASES_FOR_NON_SUPER_USER
    )
def test_non_super_user_cant_perform_unsafe_methods(
    url,
    payload,
    expected_status,
    non_superuser_client
):
    count_before = Post.objects.count() + Project.objects.count()

    resp = non_superuser_client.post(url, payload)
    assert resp.status_code == expected_status
    assert Post.objects.count() + Project.objects.count() == count_before


def test_superuser_can_add_new_project(
    superuser_client,
    project_add_url,
    projects_url
):
    count_before = Project.objects.count()
    resp = superuser_client.post(project_add_url, NEW_PROJECT_PAYLOAD)
    expected = projects_url
    assertRedirects(resp, expected)
    assert Project.objects.count() == count_before + 1
    post = Project.objects.latest("id")
    assert post.title == NEW_PROJECT_PAYLOAD["title"]
    assert post.description == NEW_PROJECT_PAYLOAD["description"]


def test_non_superuser_cant_add_new_project(
    non_superuser_client,
    project_add_url
):
    count_before = Project.objects.count()
    resp = non_superuser_client.post(project_add_url, NEW_POST_PAYLOAD)
    assert resp.status_code == HTTPStatus.FORBIDDEN
    assert Project.objects.count() == count_before


def test_super_user_have_access_to_unsafe_methods(
         client,
         superuser,
         objs
 ):
    client.force_login(superuser)
    models_names = ('post', 'project')
    names = get_unsafe_methods_names(models_names)
    urls = [
        get_reverse_urls_with_pk(name, models_names, objs)
        for name in names
    ]

    for name, url in zip(names, urls):
        print(url)
        resp_get = client.get(url)
        assert resp_get.status_code == HTTPStatus.OK

        data = NEW_POST_PAYLOAD if name == 'post' else NEW_PROJECT_PAYLOAD
        resp_post = client.post(url, data=data)

        if "delete" in name:
            assert resp_post.status_code == HTTPStatus.FOUND
        else:
            assert resp_post.status_code in {HTTPStatus.OK, HTTPStatus.FOUND}
