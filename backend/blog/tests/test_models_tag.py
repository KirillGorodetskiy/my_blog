import pytest
from django.utils.text import slugify

from blog.tests.factories import TagFactory
from blog.models import get_unique_slug, Tag


pytestmark = pytest.mark.django_db


def test_create_method():
    tag = TagFactory.build(name='My tag')
    tag.save()
    assert tag.name == "My tag"


def test_slug_creation_if_empty():
    tag = TagFactory.build(name='My tag')
    tag.save()
    assert tag.name == "My tag"
    assert tag.slug == slugify(tag.name)


def test_get_unique_slug_with_wrong_source_attr():
    tag = TagFactory.create()
    with pytest.raises(ValueError):
        get_unique_slug(tag, Tag, 'fake_name')
