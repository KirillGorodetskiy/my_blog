import pytest
from django.utils.text import slugify
from blog.models import Project
from blog.tests.factories import ProjectFactory
from django.db import connection

pytestmark = pytest.mark.django_db


def test_which_db_user_is_used():
    db_name = connection.settings_dict['NAME']
    assert db_name == connection.settings_dict['TEST']['NAME']


def test_project_slug_autogenerates_from_title() -> None:
    project = ProjectFactory.build(
        title='Fancy Project',
        slug=''
    )
    project.save()
    assert project.slug == slugify('Fancy Project')


def test_project_slug_autogenerates_when_duplicated() -> None:
    project_1 = ProjectFactory.build(
        title='project 1',
        slug=''
    )
    project_1.save()

    project_2 = ProjectFactory.build(
        title=project_1.title,
        slug=''
    )
    project_2.save()
    assert project_1.slug != project_2.slug


def test_slug_is_not_regenerated_on_update() -> None:
    project = Project.objects.create(
        title='My proj',
        description='Desctip...'
    )
    original_slug = project.slug
    project.title = 'New title'

    assert project.slug == original_slug


def test_str_representation():
    project = ProjectFactory.create()

    assert str(project) == f'Project #{project.pk}: {project.title}'
