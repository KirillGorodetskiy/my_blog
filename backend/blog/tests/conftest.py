from datetime import timedelta

import pytest
from django.conf import settings
from django.contrib.auth import get_user_model
from django.test.client import Client
from django.urls import reverse

from blog.models import Post, Project
from blog.tests.factories import PostFactory, ProjectFactory


User = get_user_model()


@pytest.fixture
def admin_url():
    return reverse('admin')


@pytest.fixture
def home_url():
    return reverse('home')


@pytest.fixture
def post_add_url():
    return reverse('post_add')


@pytest.fixture
def post_detail_url(post_obj):
    return reverse('post_detail', kwargs={'pk': post_obj.pk})


@pytest.fixture
def post_edit_url(post_obj):
    return reverse('post_edit', kwargs={'pk': post_obj.pk})


@pytest.fixture
def post_delete_url(post_obj):
    return reverse('post_delete', kwargs={'pk': post_obj.pk})


@pytest.fixture
def projects_url():
    return reverse('projects')


@pytest.fixture
def project_add_url():
    return reverse('project_add')


@pytest.fixture
def project_detail_url(project_obj):
    return reverse('project_detail', kwargs={'pk': project_obj.pk})


@pytest.fixture
def project_edit_url(project_obj):
    return reverse('project_edit', kwargs={'pk': project_obj.pk})


@pytest.fixture
def project_delete_url(project_obj):
    return reverse('project_delete', kwargs={'pk': project_obj.pk})


@pytest.fixture
def post_list():
    return PostFactory.create_batch(
        size=settings.POST_COUNT_ON_PAGE + 5,
        is_published=True,
    )


@pytest.fixture
def project_list():
    return ProjectFactory.create_batch(
        size=settings.POST_COUNT_ON_PAGE + 5,
        is_published=True,
    )


@pytest.fixture
def non_superuser():
    return User.objects.create_user(
        username='I_user',
        email='us_user@lost.com',
        password='pass1dssAb'
    )


@pytest.fixture
def superuser():
    return User.objects.create_superuser(
        username='admin',
        email='admin@lost.com',
        password='pass1234Ab'
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


@pytest.fixture
def objs():
    return {
        'post': Post.objects.create(
            title='T',
            body='C',
            is_published=True,
        ),
        'project': Project.objects.create(
            title='P',
            description='D',
            is_published=True,
        ),
    }


@pytest.fixture
def post():
    return Post.objects.create(
        title='My title',
        body='My long beatiful message...'
    )


@pytest.fixture
def post_obj():
    return Post.objects.create(
        title='My title',
        body='My long beatiful message...',
        is_published=True,
    )


@pytest.fixture
def project():
    return Project.objects.create(
        title='My project',
        description='Super description'
    )


@pytest.fixture
def project_obj():
    return Project.objects.create(
        title='My project',
        description='Super description',
        is_published=True,
    )
