from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.template import loader
from .models import Post, Project
from .forms import PostForm, ProjectForm
from django.contrib.auth.decorators import login_required
from django.views.generic import CreateView, DetailView, DeleteView, ListView, UpdateView
from django.urls import reverse, reverse_lazy


class PostListView(ListView):
    model = Post
    template_name = 'blog/index.html'


class PostDetailView(DetailView):
    model = Post


class PostUpdateView(UpdateView):
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


class PostCreateView(CreateView):
    model = Post
    form_class = PostForm
    success_url = reverse_lazy('home')
    template_name = 'blog/add_post.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form_title'] = 'Add Post'
        context['button_text'] = 'Add Post'
        return context


class PostDeleteView(DeleteView):
    model = Post
    template_name = 'confirm_delete.html'
    success_url = reverse_lazy('home')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object_name'] = self.object.title
        context['button_text'] = 'Delete Post'
        return context


class ProjectsListView(ListView):
    model = Project
    ordering = 'id'
    paginate_by = 10


class ProjectDetailView(DetailView):
    model = Project


class ProjectCreateView(CreateView):
    model = Project
    form_class = ProjectForm
    success_url = reverse_lazy('projects')
    template_name = 'blog/add_project.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form_title'] = 'Add Project'
        context['button_text'] = 'Add Project'
        return context


class ProjectUpdateView(UpdateView):
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


class ProjectDeleteView(DeleteView):
    model = Project
    template_name = 'confirm_delete.html'
    success_url = reverse_lazy('projects')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object_name'] = self.object.title
        context['button_text'] = 'Delete Project'
        return context
