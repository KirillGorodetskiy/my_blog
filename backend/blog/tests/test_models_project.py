import pytest
from django.utils.text import slugify
from blog.models import Project
from blog.tests.factories import ProjectFactory
from django.db import connection

pytestmark = pytest.mark.django_db


def test_which_db_user_is_used():
    user = connection.settings_dict['USER']
    assert user == 'myuser'

def test_project_slug_autogenerates_from_title():
    project = ProjectFactory.build(
        title='Fancy Project',
        slug=''
    )
    project.save()
    assert project.slug == slugify('Fancy Project')

