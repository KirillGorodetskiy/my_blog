from typing import Type, TypeVar

from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify


User = get_user_model()

M = TypeVar('M', bound=models.Model)


def get_unique_slug(instance: M, model: Type[M]) -> str:
    '''
    Generates a unique slug for the given model instance.
    Adds a number suffix if a slug already exists.
    '''
    base_slug = slugify(getattr(instance, 'title', ''))
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


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField()
    technologies = models.CharField(max_length=200, blank=True, null=True)
    live_link = models.URLField(max_length=200, blank=True, null=True)
    github_link = models.URLField(max_length=200, blank=True, null=True)
    added_at = models.DateTimeField(auto_now_add=True)
    icon = models.CharField(max_length=10, default="📁")
    created_at = models.DateTimeField(auto_now_add=True)

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


class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    body = models.TextField()
    project = models.ForeignKey(
        Project,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='posts'
    )
    tag = models.ManyToManyField(Tag, blank=True, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f' (Post # {self.pk})   {self.title}'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = get_unique_slug(self, Post)
        super().save(*args, **kwargs)
