import django.db.models.deletion
from django.db import migrations, models
from django.utils.text import slugify


INITIAL_CATEGORIES = (
    ('AI', 'ai'),
    ('Automation', 'automation'),
    ('Development', 'development'),
    ('Productivity', 'productivity'),
    ('Life', 'life'),
    ('Travel', 'travel'),
)


def forwards(apps, schema_editor):
    PostCategory = apps.get_model('blog', 'PostCategory')
    Post = apps.get_model('blog', 'Post')
    by_name = {}
    for name, slug in INITIAL_CATEGORIES:
        category, _ = PostCategory.objects.get_or_create(
            name=name,
            defaults={'slug': slug},
        )
        by_name[name] = category
    for post in Post.objects.all():
        name = post.category
        category = by_name.get(name)
        if category is None:
            slug = slugify(name) or f'category-{post.pk}'
            category, _ = PostCategory.objects.get_or_create(
                name=name,
                defaults={'slug': slug},
            )
            by_name[name] = category
        post.category_ref = category
        post.save(update_fields=['category_ref'])


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0014_content_auth_comments'),
    ]

    operations = [
        migrations.CreateModel(
            name='PostCategory',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                (
                    'name',
                    models.CharField(max_length=50, unique=True),
                ),
                (
                    'slug',
                    models.SlugField(max_length=60, unique=True),
                ),
            ],
            options={
                'ordering': ['name'],
                'verbose_name': 'article category',
                'verbose_name_plural': 'article categories',
            },
        ),
        migrations.AddField(
            model_name='post',
            name='category_ref',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name='posts',
                to='blog.postcategory',
            ),
        ),
        migrations.RunPython(forwards, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name='post',
            name='category',
        ),
        migrations.RenameField(
            model_name='post',
            old_name='category_ref',
            new_name='category',
        ),
        migrations.AlterField(
            model_name='post',
            name='category',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name='posts',
                to='blog.postcategory',
            ),
        ),
    ]
