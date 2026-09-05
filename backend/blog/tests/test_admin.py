from http import HTTPStatus

import pytest
from django.contrib.admin.sites import site
from django.contrib.auth import get_user_model
from django.test import Client
from django.urls import reverse
from rest_framework.test import APIClient

from blog.branding import (
    ADMIN_INDEX_TITLE,
    ADMIN_SITE_HEADER,
    ADMIN_SITE_TITLE,
    SITE_NAME,
)
from blog.models import (
    Comment,
    ModerationTerm,
    Post,
    PostCategory,
    Project,
)
from blog.tests.factories import PostFactory, ProjectFactory


User = get_user_model()
pytestmark = pytest.mark.django_db


@pytest.fixture
def api():
    return APIClient()


def test_admin_branding_uses_site_name():
    assert SITE_NAME == 'Kirill'
    assert SITE_NAME in site.site_header
    assert SITE_NAME in site.site_title
    assert site.site_header == ADMIN_SITE_HEADER
    assert site.site_title == ADMIN_SITE_TITLE
    assert site.index_title == ADMIN_INDEX_TITLE


def test_admin_login_loads_custom_assets():
    response = Client().get('/admin/login/')
    html = response.content.decode()
    assert response.status_code == HTTPStatus.OK
    assert 'admin_custom/admin.css' in html
    assert 'admin_custom/favicon.ico' in html
    assert SITE_NAME in html


def test_regular_user_cannot_open_admin(non_superuser_client):
    response = non_superuser_client.get('/admin/')
    assert response.status_code == HTTPStatus.FOUND
    assert '/admin/login/' in response['Location']


def test_staff_user_can_open_admin():
    staff = User.objects.create_user(
        username='editor',
        email='editor@example.com',
        password='SafePass123!',
        is_staff=True,
    )
    client = Client()
    client.force_login(staff)
    response = client.get('/admin/')
    assert response.status_code == HTTPStatus.OK
    assert SITE_NAME.encode() in response.content


def test_superuser_has_full_admin_access(superuser_client):
    response = superuser_client.get('/admin/')
    assert response.status_code == HTTPStatus.OK
    html = response.content.decode()
    assert 'Posts' in html
    assert 'Projects' in html
    assert 'Comments' in html


def test_post_admin_exposes_publication_fields():
    admin = site._registry[Post]
    for name in (
        'title',
        'slug',
        'is_published',
        'created_at',
        'updated_at',
        'published_at',
    ):
        assert name in admin.list_display
    assert 'is_published' in admin.list_filter
    assert 'title' in admin.search_fields
    assert admin.date_hierarchy == 'created_at'
    assert admin.prepopulated_fields == {'slug': ('title',)}
    assert 'created_at' in admin.readonly_fields
    assert 'updated_at' in admin.readonly_fields


def test_project_admin_exposes_publication_fields():
    admin = site._registry[Project]
    for name in (
        'title',
        'slug',
        'is_published',
        'created_at',
        'updated_at',
        'published_at',
    ):
        assert name in admin.list_display
    assert 'status' in admin.list_filter
    assert admin.prepopulated_fields == {'slug': ('title',)}


def test_comment_admin_supports_moderation():
    admin = site._registry[Comment]
    for name in ('author', 'status', 'created_at'):
        assert name in admin.list_display
    assert 'status' in admin.list_filter
    assert 'body' in admin.search_fields
    assert admin.date_hierarchy == 'created_at'
    action_names = {
        action.__name__
        if callable(action)
        else action
        for action in admin.actions
    }
    assert 'approve_comments' in action_names
    assert 'reject_comments' in action_names
    assert 'mark_spam_comments' in action_names


def test_post_category_admin_is_registered():
    admin = site._registry[PostCategory]
    assert 'name' in admin.list_display
    assert 'slug' in admin.list_display
    assert admin.prepopulated_fields == {'slug': ('name',)}


def test_superuser_can_add_article_category(superuser_client):
    response = superuser_client.get(
        reverse('admin:blog_postcategory_add'),
    )
    assert response.status_code == HTTPStatus.OK


def test_moderation_term_admin_is_registered():
    admin = site._registry[ModerationTerm]
    assert 'term' in admin.list_display
    assert 'is_active' in admin.list_filter


def test_article_admin_url_is_staff_only(api):
    post = PostFactory.create(
        title='Staff edit note',
        is_published=True,
    )
    change_url = reverse(
        'admin:blog_post_change',
        args=[post.pk],
    )
    anonymous = api.get(f'/api/v1/articles/{post.slug}/')
    assert anonymous.status_code == HTTPStatus.OK
    assert anonymous.json()['adminUrl'] is None

    reader = User.objects.create_user(
        username='reader',
        email='reader@example.com',
        password='SafePass123!',
    )
    api.force_login(reader)
    public = api.get(f'/api/v1/articles/{post.slug}/')
    assert public.json()['adminUrl'] is None

    reader.is_staff = True
    reader.save(update_fields=['is_staff'])
    staff = api.get(f'/api/v1/articles/{post.slug}/')
    assert staff.json()['adminUrl'] == change_url


def test_project_admin_url_is_staff_only(api):
    project = ProjectFactory.create(
        title='Staff edit project',
        is_published=True,
    )
    change_url = reverse(
        'admin:blog_project_change',
        args=[project.pk],
    )
    anonymous = api.get(f'/api/v1/projects/{project.slug}/')
    assert anonymous.json()['adminUrl'] is None

    staff = User.objects.create_user(
        username='proj-editor',
        email='proj-editor@example.com',
        password='SafePass123!',
        is_staff=True,
    )
    api.force_login(staff)
    response = api.get(f'/api/v1/projects/{project.slug}/')
    assert response.json()['adminUrl'] == change_url
