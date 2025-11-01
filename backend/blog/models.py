from typing import Type, TypeVar

from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.utils import timezone


User = get_user_model()

M = TypeVar('M', bound=models.Model)


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
            f'{model.__name__}.{source_attr} is empty; cannot build slug.'
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

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f' (Post # {self.pk})   {self.title}'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = get_unique_slug(self, Post)
        super().save(*args, **kwargs)
