from datetime import timedelta

from django.conf import settings
from django.core.cache import cache
from django.utils import timezone
from rest_framework.exceptions import Throttled, ValidationError

from blog.models import Comment, CommentStatus, ModerationTerm
from blog.textnorm import (
    count_urls,
    normalize_duplicate,
    normalize_for_match,
)


def _rate_key(kind: str, user_id: int, ip: str) -> str:
    return f'comment-rate:{kind}:{user_id}:{ip}'


def enforce_comment_rate(user_id: int, ip: str) -> None:
    limits = (
        ('minute', 60, settings.COMMENT_RATE_PER_MINUTE),
        (
            'ten',
            600,
            settings.COMMENT_RATE_PER_10_MINUTES,
        ),
        ('day', 86400, settings.COMMENT_RATE_PER_DAY),
    )
    for kind, window, limit in limits:
        key = _rate_key(kind, user_id, ip)
        used = cache.get(key, 0)
        if used >= limit:
            raise Throttled(
                detail='Comment rate limit exceeded.',
            )
        cache.set(key, used + 1, timeout=window)


def apply_moderation(body: str) -> tuple[str, str]:
    if count_urls(body) > settings.COMMENT_MAX_URLS:
        return CommentStatus.PENDING, 'too many links'

    haystack = f' {normalize_for_match(body)} '
    terms = ModerationTerm.objects.filter(is_active=True)
    for item in terms:
        needle = f' {normalize_for_match(item.term)} '
        if needle.strip() and needle in haystack:
            if item.action == 'reject':
                return CommentStatus.REJECTED, 'blocked term'
            if item.action == 'spam':
                return CommentStatus.SPAM, 'blocked term'
            return CommentStatus.PENDING, 'blocked term'
    return CommentStatus.APPROVED, ''


def reject_duplicate(
    author_id: int,
    body: str,
    post_id: int | None,
    project_id: int | None,
) -> None:
    window = timezone.now() - timedelta(
        seconds=settings.COMMENT_DUPLICATE_SECONDS,
    )
    query = Comment.objects.filter(
        author_id=author_id,
        created_at__gte=window,
    )
    if post_id:
        query = query.filter(post_id=post_id)
    else:
        query = query.filter(project_id=project_id)
    incoming = normalize_duplicate(body)
    for existing in query:
        if normalize_duplicate(existing.body) == incoming:
            raise ValidationError(
                {'body': 'Duplicate comment.'},
            )


def validate_comment_body(body: str) -> str:
    text = body.strip()
    minimum = settings.COMMENT_MIN_LENGTH
    maximum = settings.COMMENT_MAX_LENGTH
    if len(text) < minimum:
        raise ValidationError(
            {'body': f'Comment must be at least {minimum} characters.'},
        )
    if len(text) > maximum:
        raise ValidationError(
            {'body': f'Comment must be at most {maximum} characters.'},
        )
    return text
