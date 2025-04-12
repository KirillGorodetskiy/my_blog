"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from blog.views import show_all_posts, show_post, add_post, delete_post, my_projects

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', show_all_posts, name='home'),
    path('post/<int:id>', show_post, name='post_detail'),
    path('add/', add_post, name='add_post'),
    path('post/<int:post_id>/delete/', delete_post, name='delete_post'),
    path('my_projects/', my_projects, name='my_projects'),
    path('accounts/', include('django.contrib.auth.urls')),
]
