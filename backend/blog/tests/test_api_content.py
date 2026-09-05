from http import HTTPStatus

import pytest
from rest_framework.test import APIClient

from blog.models import Comment, CommentStatus
from blog.reading import reading_time_minutes
from blog.tests.factories import (
    PostFactory,
    ProjectFactory,
    TagFactory,
)


pytestmark = pytest.mark.django_db


@pytest.fixture
def api():
    return APIClient()


def test_article_list_hides_unpublished(api):
    published = PostFactory.create(
        title='Public note',
        is_published=True,
        excerpt='Visible excerpt',
        category='AI',
    )
    PostFactory.create(
        title='Secret note',
        is_published=False,
        excerpt='Hidden',
    )
    response = api.get('/api/v1/articles/')
    slugs = [item['slug'] for item in response.json()]
    assert response.status_code == HTTPStatus.OK
    assert published.slug in slugs
    assert 'secret-note' not in slugs


def test_article_detail_uses_slug(api):
    post = PostFactory.create(
        title='Slug detail',
        is_published=True,
        body='word ' * 450,
        excerpt='Short',
        category='Development',
    )
    response = api.get(f'/api/v1/articles/{post.slug}/')
    payload = response.json()
    assert response.status_code == HTTPStatus.OK
    assert payload['slug'] == post.slug
    assert payload['readTimeMinutes'] == reading_time_minutes(
        post.body,
    )
    assert payload['date']
    assert 'id' not in payload


def test_unpublished_article_detail_is_hidden(api):
    post = PostFactory.create(is_published=False, title='Draft')
    response = api.get(f'/api/v1/articles/{post.slug}/')
    assert response.status_code == HTTPStatus.NOT_FOUND


def test_article_category_uses_admin_managed_name(api):
    post = PostFactory.create(
        title='Custom aisle',
        is_published=True,
        category='Hardware',
        excerpt='New category',
    )
    response = api.get(f'/api/v1/articles/{post.slug}/')
    assert response.status_code == HTTPStatus.OK
    assert response.json()['category'] == 'Hardware'


def test_article_serializer_maps_tags(api):
    tag = TagFactory.create(name='django')
    post = PostFactory.create(
        is_published=True,
        title='Tagged',
        excerpt='Has a tag',
    )
    post.tag.add(tag)
    response = api.get(f'/api/v1/articles/{post.slug}/')
    assert response.json()['tags'] == ['django']


def test_project_list_and_detail_mapping(api):
    project = ProjectFactory.create(
        title='API project',
        is_published=True,
        category='AI',
        status='active',
        featured=True,
        technologies='Python, Django',
        live_link='https://example.com/demo',
        github_link='https://github.com/example/repo',
        failure_handling='Retry then stop',
        lessons='Keep deploys boring\nTest first',
    )
    hidden = ProjectFactory.create(
        title='Hidden project',
        is_published=False,
    )
    listing = api.get('/api/v1/projects/')
    slugs = [item['slug'] for item in listing.json()]
    assert project.slug in slugs
    assert hidden.slug not in slugs

    detail = api.get(f'/api/v1/projects/{project.slug}/').json()
    assert detail['demoUrl'] == 'https://example.com/demo'
    assert detail['githubUrl'] == (
        'https://github.com/example/repo'
    )
    assert detail['failureHandling'] == 'Retry then stop'
    assert detail['technologies'] == ['Python', 'Django']
    assert detail['lessons'] == [
        'Keep deploys boring',
        'Test first',
    ]
    assert detail['screenshots'] == []


def test_unpublished_project_detail_is_hidden(api):
    project = ProjectFactory.create(
        is_published=False,
        title='Draft project',
    )
    response = api.get(f'/api/v1/projects/{project.slug}/')
    assert response.status_code == HTTPStatus.NOT_FOUND


def test_search_excludes_unpublished_and_matches_fields(api):
    tag = TagFactory.create(name='homelab')
    visible = PostFactory.create(
        title='Visible search',
        is_published=True,
        excerpt='rack notes',
        body='server closet',
        category='Life',
    )
    visible.tag.add(tag)
    PostFactory.create(
        title='Hidden search',
        is_published=False,
        excerpt='rack notes',
        body='server closet',
    )
    ProjectFactory.create(
        title='Visible tool',
        is_published=True,
        description='crm routing',
        category='Automation',
    )
    ProjectFactory.create(
        title='Hidden tool',
        is_published=False,
        description='crm routing',
    )
    response = api.get('/api/v1/search/', {'q': 'rack'})
    articles = response.json()['articles']
    assert any(item['slug'] == visible.slug for item in articles)
    assert all(
        item['slug'] != 'hidden-search' for item in articles
    )

    projects = api.get(
        '/api/v1/search/',
        {'q': 'crm'},
    ).json()['projects']
    assert any(item['slug'] == 'visible-tool' for item in projects)
    assert all(item['slug'] != 'hidden-tool' for item in projects)


def test_comments_on_unpublished_content_are_hidden(
    api,
    non_superuser,
):
    post = PostFactory.create(is_published=False, title='Quiet')
    Comment.objects.create(
        author=non_superuser,
        post=post,
        body='Should stay private',
        status=CommentStatus.APPROVED,
    )
    response = api.get(f'/api/v1/articles/{post.slug}/comments/')
    assert response.status_code == HTTPStatus.NOT_FOUND
