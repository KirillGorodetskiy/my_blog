from django.contrib import admin
from django.urls import path, include
from blog import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('', views.PostListView.as_view(), name='home'),
    path(
        'post/<int:pk>/',
        views.PostDetailView.as_view(),
        name='post_detail'
    ),
    path(
        'post/<int:pk>/edit/',
        views.PostUpdateView.as_view(),
        name='post_edit'
    ),
    path(
        'post/add/',
        views.PostCreateView.as_view(),
        name='post_add'
    ),
    path(
        'post/<int:pk>/delete/',
        views.PostDeleteView.as_view(),
        name='post_delete'
    ),
    path('projects/', views.ProjectsListView.as_view(), name='projects'),
    path(
        'projects/add/',
        views.ProjectCreateView.as_view(),
        name='project_add'
    ),
    path(
        'projects/<int:pk>/',
        views.ProjectDetailView.as_view(),
        name='project_detail'
    ),
    path(
        'projects/<int:pk>/edit/',
        views.ProjectUpdateView.as_view(),
        name='project_edit'
    ),
    path(
        'projects/<int:pk>/delete/',
        views.ProjectDeleteView.as_view(),
        name='project_delete'
    ),
]
