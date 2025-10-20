import factory

from django.utils.text import slugify
from blog.models import Post, Project, Tag


class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Project

    title = factory.Sequence(lambda n: f'Project title {n}')
    description = 'A description'
    technologies = 'Django, Python'


