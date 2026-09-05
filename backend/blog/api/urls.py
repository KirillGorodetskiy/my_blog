from django.urls import path

from blog.api.views import (
    ArticleCommentListView,
    ArticleDetailView,
    ArticleListView,
    CommentDeleteView,
    LoginView,
    LogoutView,
    MeView,
    ProjectCommentListView,
    ProjectDetailView,
    ProjectListView,
    RegisterView,
    SearchView,
)


def optional_slash(route: str, view):
    clean = route.rstrip('/')
    return [
        path(f'{clean}/', view),
        path(clean, view),
    ]


urlpatterns = []
for pattern, view in (
    ('articles/', ArticleListView.as_view()),
    (
        'articles/<slug:slug>/',
        ArticleDetailView.as_view(),
    ),
    (
        'articles/<slug:slug>/comments/',
        ArticleCommentListView.as_view(),
    ),
    ('projects/', ProjectListView.as_view()),
    (
        'projects/<slug:slug>/',
        ProjectDetailView.as_view(),
    ),
    (
        'projects/<slug:slug>/comments/',
        ProjectCommentListView.as_view(),
    ),
    (
        'comments/<int:pk>/',
        CommentDeleteView.as_view(),
    ),
    ('search/', SearchView.as_view()),
    ('auth/me/', MeView.as_view()),
    ('auth/register/', RegisterView.as_view()),
    ('auth/login/', LoginView.as_view()),
    ('auth/logout/', LogoutView.as_view()),
):
    urlpatterns.extend(optional_slash(pattern, view))
