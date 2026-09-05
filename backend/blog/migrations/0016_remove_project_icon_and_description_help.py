import blog.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0015_post_category_model'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='icon',
        ),
        migrations.AlterField(
            model_name='post',
            name='category',
            field=models.ForeignKey(
                default=blog.models.default_post_category_pk,
                on_delete=django.db.models.deletion.PROTECT,
                related_name='posts',
                to='blog.postcategory',
            ),
        ),
        migrations.AlterField(
            model_name='project',
            name='description',
            field=models.TextField(
                help_text=(
                    'Short card and hero summary. Use 1-3 '
                    'sentences. Put case-study detail in '
                    'the section fields.'
                ),
            ),
        ),
    ]
