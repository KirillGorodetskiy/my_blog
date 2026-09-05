import factory

from django.utils.text import slugify
from blog.models import Post, PostCategory, Project, Tag


def ensure_post_category(name: str) -> PostCategory:
    slug = slugify(name) or 'category'
    category, _ = PostCategory.objects.get_or_create(
        name=name,
        defaults={'slug': slug},
    )
    return category


class PostCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PostCategory
        django_get_or_create = ('name',)

    name = factory.Sequence(lambda n: f'Category {n}')
    slug = factory.LazyAttribute(lambda obj: slugify(obj.name))


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

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        raw = kwargs.pop('category', 'Development')
        if isinstance(raw, str):
            raw = ensure_post_category(raw)
        kwargs['category'] = raw
        return super()._create(model_class, *args, **kwargs)

    @classmethod
    def _build(cls, model_class, *args, **kwargs):
        raw = kwargs.pop('category', 'Development')
        if isinstance(raw, str):
            raw = ensure_post_category(raw)
        kwargs['category'] = raw
        return super()._build(model_class, *args, **kwargs)


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tag

    name = factory.Sequence(lambda n: f'Tag # {n}')
