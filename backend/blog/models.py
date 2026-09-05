from typing import Type, TypeVar

from django.conf import settings
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.utils import timezone


User = get_user_model()

M = TypeVar('M', bound=models.Model)


class PostCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'article category'
        verbose_name_plural = 'article categories'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = get_unique_slug(
                self,
                PostCategory,
                'name',
            )
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


def default_post_category_pk() -> int:
    category, _ = PostCategory.objects.get_or_create(
        name='Development',
        defaults={'slug': 'development'},
    )
    return category.pk


class ProjectCategory(models.TextChoices):
    AUTOMATION = 'Automation', 'Automation'
    AI = 'AI', 'AI'
    WEB_APPS = 'Web Apps', 'Web Apps'
    INFRASTRUCTURE = 'Infrastructure', 'Infrastructure'
    HARDWARE = 'Hardware', 'Hardware'
    OTHER = 'Other', 'Other'


class ProjectStatus(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    ACTIVE = 'active', 'Active'
    PAUSED = 'paused', 'Paused'
    COMPLETE = 'complete', 'Complete'


class CommentStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'
    SPAM = 'spam', 'Spam'


class ModerationAction(models.TextChoices):
    PENDING = 'pending', 'Hold as pending'
    REJECT = 'reject', 'Reject'
    SPAM = 'spam', 'Mark as spam'


def get_unique_slug(
        instance: M,
        model: Type[M],
        source_attr: str = 'title'
        ) -> str:
    '''
    Generates a unique slug for the given model instance.
    Adds a number suffix if a slug already exists.
    '''
    raw = getattr(instance, source_attr, '')
    if not raw:
        raise ValueError(
            f'{model.__name__}.{source_attr} is empty; '
            'cannot build slug.'
        )
    base_slug = slugify(raw)
    slug = base_slug
    num = 1
    while (
        model.objects
        .filter(slug=slug)
        .exclude(pk=getattr(instance, 'pk', None))
        .exists()
    ):
        slug = f'{base_slug}-{num}'
        num += 1
    return slug


class ProjectPostBase(models.Model):
    '''base model to support DRY approach'''
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # we don`t need table for this class
        abstract = True
        ordering = ['-created_at']

    @property
    def publish_label(self):
        '''we use the property in template to mark published projects'''
        return 'Published' if self.is_published else 'Unpublished'

    @property
    def publish_badge_class(self):
        return 'bg-success' if self.is_published else 'bg-secondary'

    def save(self, *args, **kwargs):
        # Auto-set published_at
        # we don`t update this field since
        # we have 'updated_at' field
        if self.is_published and not self.published_at:
            self.published_at = timezone.now()

        super().save(*args, **kwargs)


class Project(ProjectPostBase):
    description = models.TextField()
    technologies = models.CharField(max_length=200, blank=True, null=True)
    live_link = models.URLField(max_length=200, blank=True, null=True)
    github_link = models.URLField(max_length=200, blank=True, null=True)
    icon = models.CharField(max_length=10, default="📁", blank=True)
    category = models.CharField(
        max_length=32,
        choices=ProjectCategory.choices,
        default=ProjectCategory.OTHER,
    )
    featured = models.BooleanField(default=False)
    status = models.CharField(
        max_length=16,
        choices=ProjectStatus.choices,
        default=ProjectStatus.ACTIVE,
    )
    image = models.ImageField(
        upload_to='projects/%Y/%m/',
        blank=True,
    )
    problem = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    architecture = models.TextField(blank=True)
    workflow = models.TextField(blank=True)
    integrations = models.TextField(blank=True)
    failure_handling = models.TextField(blank=True)
    lessons = models.TextField(
        blank=True,
        help_text='One lesson per line.',
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'Project #{self.pk}: {self.title}'

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            self.slug = get_unique_slug(self, Project)
        super().save(*args, **kwargs)


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = get_unique_slug(self, Tag, 'name')
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Post(ProjectPostBase):
    body = models.TextField()
    project = models.ForeignKey(
        Project,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='posts'
    )
    tag = models.ManyToManyField(
        Tag,
        blank=True,
        related_name='posts'
    )
    category = models.ForeignKey(
        PostCategory,
        on_delete=models.PROTECT,
        related_name='posts',
        default=default_post_category_pk,
    )
    excerpt = models.TextField(blank=True)
    image = models.ImageField(
        upload_to='posts/%Y/%m/',
        blank=True,
    )
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f' (Post # {self.pk})   {self.title}'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = get_unique_slug(self, Post)
        super().save(*args, **kwargs)


class ProjectScreenshot(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='screenshots',
    )
    image = models.ImageField(
        upload_to='project_screenshots/%Y/%m/',
    )
    alt = models.CharField(max_length=200, blank=True)
    caption = models.CharField(max_length=300, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'id']

    def __str__(self) -> str:
        return f'Screenshot for {self.project.title}'


class Comment(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='comments',
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='comments',
    )
    body = models.TextField()
    status = models.CharField(
        max_length=16,
        choices=CommentStatus.choices,
        default=CommentStatus.PENDING,
    )
    moderation_reason = models.CharField(
        max_length=200,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        constraints = [
            models.CheckConstraint(
                name='comment_exactly_one_target',
                condition=(
                    models.Q(post__isnull=False, project__isnull=True)
                    | models.Q(
                        post__isnull=True,
                        project__isnull=False,
                    )
                ),
            ),
        ]

    def __str__(self) -> str:
        return f'Comment #{self.pk} by {self.author}'


class ModerationTerm(models.Model):
    term = models.CharField(max_length=80)
    is_active = models.BooleanField(default=True)
    action = models.CharField(
        max_length=16,
        choices=ModerationAction.choices,
        default=ModerationAction.PENDING,
    )

    class Meta:
        ordering = ['term']

    def __str__(self) -> str:
        return self.term
