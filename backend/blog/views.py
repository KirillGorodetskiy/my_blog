from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.template import loader
from .models import Post, Project
from .forms import PostForm, ProjectForm
from django.contrib.auth.decorators import login_required

# Create your views here.


def show_all_posts(request):
    posts = Post.objects.all()
    context = {
        'posts': posts,
    }
    template = loader.get_template('index.html')
    return HttpResponse(template.render(context, request))


def show_post(request, id):
    post = Post.objects.get(id=id)
    context = {
        'post': post,
    }
    template = loader.get_template('post_details.html')
    return HttpResponse(template.render(context, request))


def my_projects(request):
    projects = Project.objects.all()
    context = {'projects': projects}
    return render(request, 'my_projects.html', context)


@login_required
def add_project(request):
    if request.method == 'POST':
        form = ProjectForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/my_projects')
    else:
        form = ProjectForm()
        return render(request, 'add_project.html', {'form': form,
                                                    'form_title': 'Add Project',
                                                    'button_text': 'Add Project'})
    
@login_required
def edit_project(request, pk):
    project = get_object_or_404(Project, pk=pk)

    if request.method == 'POST':
        form = ProjectForm(request.POST, instance=project)
        if form.is_valid():
            form.save()
            return redirect('/my_projects')
    else:
        form = ProjectForm(instance=project)
        return render(request, 'add_project.html', {'form': form,
                                                    'form_title' : 'Edit Project',
                                                    'button_text': 'Save Changes'})


@login_required
def delete_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    if request.method == 'POST':
        post.delete()
        return redirect('/')

    # If the user visits this via GET (e.g., after login redirect), redirect them
    return redirect('post_detail', id=post_id)


@login_required
def add_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/')
    else:
        form = PostForm()
        return render(request, 'add_post.html', {'form': form,
                                                 'form_title' : 'Add Post' ,
                                                 'button_text': 'Add Post'})
    
@login_required
def edit_post(request, id):
    post = get_object_or_404(Post, id=id)

    if request.method == 'POST':
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            return redirect('post_detail', id=post.id)
    else:
        form = PostForm(instance=post)
        return render(request, 'add_post.html', {'form': form,
                                                 'form_title' : 'Edit Post' ,
                                                 'button_text': 'Save Changes'})