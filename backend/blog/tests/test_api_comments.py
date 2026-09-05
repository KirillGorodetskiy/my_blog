from http import HTTPStatus

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from blog.models import Comment, CommentStatus, ModerationTerm
from blog.tests.factories import PostFactory, ProjectFactory


User = get_user_model()


pytestmark = pytest.mark.django_db


@pytest.fixture
def api():
    return APIClient()


@pytest.fixture
def published_post():
    return PostFactory.create(
        title='Open article',
        is_published=True,
    )


@pytest.fixture
def published_project():
    return ProjectFactory.create(
        title='Open project',
        is_published=True,
    )


def test_comment_list_works_without_trailing_slash(
    api,
    published_post,
):
    response = api.get(
        f'/api/v1/articles/{published_post.slug}/comments',
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json() == []


def test_comment_can_delete_is_owner_or_superuser(
    api,
    non_superuser,
    superuser,
    published_post,
):
    comment = Comment.objects.create(
        author=non_superuser,
        post=published_post,
        body='Owned',
        status=CommentStatus.APPROVED,
    )
    path = f'/api/v1/articles/{published_post.slug}/comments/'
    anon = api.get(path).json()[0]
    assert anon['canDelete'] is False

    api.force_login(non_superuser)
    owner = api.get(path).json()[0]
    assert owner['id'] == comment.pk
    assert owner['canDelete'] is True

    other = User.objects.create_user(
        username='other',
        email='other@example.com',
        password='SafePass123!',
    )
    api.force_login(other)
    stranger = api.get(path).json()[0]
    assert stranger['canDelete'] is False

    api.force_login(superuser)
    admin = api.get(path).json()[0]
    assert admin['canDelete'] is True


def test_anonymous_cannot_comment(api, published_post):
    response = api.post(
        f'/api/v1/articles/{published_post.slug}/comments/',
        {'body': 'Hello there'},
        format='json',
    )
    assert response.status_code == HTTPStatus.FORBIDDEN
    assert Comment.objects.count() == 0


def test_authenticated_user_can_comment(
    api,
    non_superuser,
    published_post,
):
    api.force_login(non_superuser)
    response = api.post(
        f'/api/v1/articles/{published_post.slug}/comments/',
        {'body': 'Useful article.'},
        format='json',
    )
    assert response.status_code == HTTPStatus.CREATED
    assert response.json()['status'] == CommentStatus.APPROVED
    assert response.json()['author'] == non_superuser.username


def test_public_list_shows_only_approved(
    api,
    non_superuser,
    published_post,
):
    Comment.objects.create(
        author=non_superuser,
        post=published_post,
        body='Visible',
        status=CommentStatus.APPROVED,
    )
    Comment.objects.create(
        author=non_superuser,
        post=published_post,
        body='Hidden pending',
        status=CommentStatus.PENDING,
    )
    response = api.get(
        f'/api/v1/articles/{published_post.slug}/comments/',
    )
    bodies = [item['body'] for item in response.json()]
    assert bodies == ['Visible']


def test_owner_can_delete_comment(
    api,
    non_superuser,
    published_project,
):
    comment = Comment.objects.create(
        author=non_superuser,
        project=published_project,
        body='Mine',
        status=CommentStatus.APPROVED,
    )
    api.force_login(non_superuser)
    response = api.delete(f'/api/v1/comments/{comment.pk}/')
    assert response.status_code == HTTPStatus.NO_CONTENT
    assert not Comment.objects.filter(pk=comment.pk).exists()


def test_other_user_cannot_delete_comment(
    api,
    non_superuser,
    superuser,
    published_post,
):
    comment = Comment.objects.create(
        author=superuser,
        post=published_post,
        body='Admin note',
        status=CommentStatus.APPROVED,
    )
    api.force_login(non_superuser)
    response = api.delete(f'/api/v1/comments/{comment.pk}/')
    assert response.status_code == HTTPStatus.FORBIDDEN


def test_superuser_can_delete_any_comment(
    api,
    non_superuser,
    superuser,
    published_post,
):
    comment = Comment.objects.create(
        author=non_superuser,
        post=published_post,
        body='Please remove',
        status=CommentStatus.APPROVED,
    )
    api.force_login(superuser)
    response = api.delete(f'/api/v1/comments/{comment.pk}/')
    assert response.status_code == HTTPStatus.NO_CONTENT


def test_moderation_term_holds_comment(
    api,
    non_superuser,
    published_post,
):
    ModerationTerm.objects.create(
        term='spamword',
        is_active=True,
        action='pending',
    )
    api.force_login(non_superuser)
    response = api.post(
        f'/api/v1/articles/{published_post.slug}/comments/',
        {'body': 'This has SpamWord inside'},
        format='json',
    )
    assert response.json()['status'] == CommentStatus.PENDING


def test_duplicate_comment_rejected(
    api,
    non_superuser,
    published_post,
):
    api.force_login(non_superuser)
    payload = {'body': 'Same words again'}
    first = api.post(
        f'/api/v1/articles/{published_post.slug}/comments/',
        payload,
        format='json',
    )
    second = api.post(
        f'/api/v1/articles/{published_post.slug}/comments/',
        payload,
        format='json',
    )
    assert first.status_code == HTTPStatus.CREATED
    assert second.status_code == HTTPStatus.BAD_REQUEST


def test_rate_limit_blocks_extra_comments(
    api,
    non_superuser,
    published_post,
    settings,
):
    settings.COMMENT_RATE_PER_MINUTE = 1
    settings.COMMENT_RATE_PER_10_MINUTES = 10
    settings.COMMENT_RATE_PER_DAY = 30
    api.force_login(non_superuser)
    first = api.post(
        f'/api/v1/articles/{published_post.slug}/comments/',
        {'body': 'First comment'},
        format='json',
    )
    second = api.post(
        f'/api/v1/articles/{published_post.slug}/comments/',
        {'body': 'Second comment'},
        format='json',
    )
    assert first.status_code == HTTPStatus.CREATED
    assert second.status_code == HTTPStatus.TOO_MANY_REQUESTS
    assert Comment.objects.filter(
        author=non_superuser,
    ).count() == 1


def test_comment_requires_exactly_one_target(non_superuser):
    with pytest.raises(Exception):
        Comment.objects.create(
            author=non_superuser,
            body='No target',
        )
