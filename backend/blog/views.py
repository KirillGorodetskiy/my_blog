from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import (
    CreateView, DetailView, DeleteView, ListView, UpdateView
)
from django.urls import reverse, reverse_lazy

from .models import Post, Project
from .forms import PostForm, ProjectForm


class PublishedOnlyUnlessSuperuserMixin:
    '''We don`t want to show unpublished material to users'''
    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_superuser:
            return qs
        return qs.filter(is_published=True)


class SuperUserOnlyMixin(
    LoginRequiredMixin,
    UserPassesTestMixin
):
    '''Allow access to unsafe methods to superuser only'''
    raise_exception = True  # raise 403 Error

    def test_func(self):
        return self.request.user.is_superuser


class PostListView(
    PublishedOnlyUnlessSuperuserMixin,
    ListView
):
    model = Post
    ordering = 'created_at'
    template_name = 'blog/index.html'
    paginate_by = settings.POST_COUNT_ON_PAGE


class PostDetailView(
    PublishedOnlyUnlessSuperuserMixin,
    DetailView
):
    model = Post


class PostUpdateView(SuperUserOnlyMixin, UpdateView):
    model = Post
    form_class = PostForm
    template_name = 'blog/add_post.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form_title'] = 'Edit post'
        context['button_text'] = 'Save Changes'
        return context

    def get_success_url(self) -> str:
        return reverse('post_detail', kwargs={'pk': self.object.pk})


class PostCreateView(SuperUserOnlyMixin, CreateView):
    model = Post
    form_class = PostForm
    success_url = reverse_lazy('home')
    template_name = 'blog/add_post.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form_title'] = 'Add Post'
        context['button_text'] = 'Add Post'
        return context


class PostDeleteView(SuperUserOnlyMixin, DeleteView):
    model = Post
    template_name = 'confirm_delete.html'
    success_url = reverse_lazy('home')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object_name'] = self.object.title
        context['button_text'] = 'Delete Post'
        return context


class ProjectsListView(
    PublishedOnlyUnlessSuperuserMixin,
    ListView
):
    model = Project
    ordering = 'created_at'
    paginate_by = settings.PROJECT_COUNT_ON_PAGE


class ProjectDetailView(
    PublishedOnlyUnlessSuperuserMixin,
    DetailView
):
    model = Project


class ProjectCreateView(SuperUserOnlyMixin, CreateView):
    model = Project
    form_class = ProjectForm
    success_url = reverse_lazy('projects')
    template_name = 'blog/add_project.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form_title'] = 'Add Project'
        context['button_text'] = 'Add Project'
        return context


class ProjectUpdateView(SuperUserOnlyMixin, UpdateView):
    model = Project
    form_class = ProjectForm
    template_name = 'blog/add_project.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form_title'] = 'Edit Project'
        context['button_text'] = 'Save Changes'
        return context

    def get_success_url(self) -> str:
        return reverse('project_detail', kwargs={'pk': self.object.pk})


class ProjectDeleteView(SuperUserOnlyMixin, DeleteView):
    model = Project
    template_name = 'confirm_delete.html'
    success_url = reverse_lazy('projects')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object_name'] = self.object.title
        context['button_text'] = 'Delete Project'
        return context
