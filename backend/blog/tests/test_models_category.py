import pytest

from django.db import IntegrityError

from blog.models import Post, PostCategory
from blog.tests.factories import PostFactory


pytestmark = pytest.mark.django_db


def test_post_category_slug_from_name():
    category = PostCategory(name='Deep Learning')
    category.save()
    assert category.slug == 'deep-learning'


def test_post_category_name_must_be_unique():
    PostCategory.objects.create(name='Notes')
    with pytest.raises(IntegrityError):
        PostCategory.objects.create(name='Notes')


def test_post_factory_accepts_category_name():
    post = PostFactory.create(category='Hardware')
    assert isinstance(post.category, PostCategory)
    assert post.category.name == 'Hardware'


def test_post_requires_a_category():
    post = PostFactory.create(category='Life')
    assert Post.objects.get(pk=post.pk).category.name == 'Life'
