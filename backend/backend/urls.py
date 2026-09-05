from django.contrib import admin
from django.conf import settings
from django.urls import path, include, re_path
from django.views.static import serve


urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('api/v1/', include('blog.api.urls')),
    path('', include('blog.urls')),
    re_path(
        r'^media/(?P<path>.*)$',
        serve,
        {'document_root': settings.MEDIA_ROOT},
    ),
]
