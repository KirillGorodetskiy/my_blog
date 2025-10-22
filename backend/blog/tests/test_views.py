from http import HTTPStatus

import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse, NoReverseMatch

from blog.models import Project, Post

User = get_user_model()

pytestmark = pytest.mark.django_db


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


@pytest.fixture
def superuser():
    return User.objects.create_superuser(
        username='admin',
        email='admin@lost.com',
        password='pass1234Ab'
    )


@pytest.fixture
def non_superuser():
    return User.objects.create_user(
        username='I_user',
        email='us_user@lost.com',
        password='pass1dssAb'
    )


@pytest.fixture
def objs():
    return {
        'post': Post.objects.create(title='T', body='C'),
        'project': Project.objects.create(title='P', description='D')
    }


@pytest.fixture
def post():
    return Post.objects.create(
        title='My title',
        body='My long beatiful message...'
    )


@pytest.fixture
def project():
    return Project.objects.create(
        title='My project',
        description='Super description'
    )


def test_no_access_to_unsafe_methods_for_non_super_user(
        client,
        non_superuser,
        objs
):
    client.force_login(non_superuser)
    models_names = ('post', 'project')
    names = get_unsafe_methods_names(models_names)
    urls = [
        get_reverse_urls_with_pk(name, models_names, objs)
        for name in names
    ]

    for url in urls:
        resp_get = client.get(url)
        resp_post = client.post(url)
        assert resp_get.status_code == HTTPStatus.FORBIDDEN
        assert resp_post.status_code == HTTPStatus.FORBIDDEN


def payload_for(name: str):
    if name.startswith("post_") and ("add" in name or "edit" in name):
        return {"title": "T", "body": "C"}
    if name.startswith("project_") and ("add" in name or "edit" in name):
        return {"title": "P", "description": "D"}
    return {}


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

        data = payload_for(name)
        resp_post = client.post(url, data=data)

        if "delete" in name:
            assert resp_post.status_code == HTTPStatus.FOUND
        else:
            assert resp_post.status_code in {HTTPStatus.OK, HTTPStatus.FOUND}
