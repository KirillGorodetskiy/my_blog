from django import forms
from .models import Post, Project

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'body']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'body': forms.Textarea(attrs={'class': 'form-control', 'rows': 6}),
        }

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'description', 'icon', 'live_link', 'github_link']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 6}),
            'icon': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., 🚀 or 💻'}),
            'live_link': forms.TextInput(attrs={'class': 'form-control'}),
            'github_link': forms.TextInput(attrs={'class': 'form-control'}),
        }
