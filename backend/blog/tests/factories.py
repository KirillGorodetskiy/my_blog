import factory

from django.utils.text import slugify
from blog.models import Post, Project, Tag


class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Project

    title = factory.Sequence(lambda n: f'Project title {n}')
    description = 'A description'
    technologies = 'Django, Python'


class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Post

    title = factory.Sequence(lambda n: f'Post title {n}')
    body = 'This is body...'


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tag

    name = factory.Sequence(lambda n: f'Tag # {n}')
