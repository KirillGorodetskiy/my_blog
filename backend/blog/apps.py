from django.apps import AppConfig


class BlogConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blog'

    def ready(self) -> None:
        from django.contrib import admin

        from blog.branding import (
            ADMIN_INDEX_TITLE,
            ADMIN_SITE_HEADER,
            ADMIN_SITE_TITLE,
        )

        admin.site.site_header = ADMIN_SITE_HEADER
        admin.site.site_title = ADMIN_SITE_TITLE
        admin.site.index_title = ADMIN_INDEX_TITLE
