from django import forms
from .models import Post, Project


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'body', 'is_published']
        labels = {
            "is_published": "Publish this post",
        }
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'body': forms.Textarea(attrs={'class': 'form-control', 'rows': 6}),
            'is_published': forms.CheckboxInput(
                attrs={"class": "form-check-input"}
            )
        }


class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = [
            'title',
            'description',
            'technologies',
            'icon',
            'live_link',
            'github_link',
            'is_published'
        ]
        labels = {
            "is_published": "Publish this project",
        }
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(
                attrs={'class': 'form-control', 'rows': 6}
            ),
            'is_published': forms.CheckboxInput(
                attrs={"class": "form-check-input"}
            ),
            'technologies': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'placeholder': 'e.g., Python, Django, PostgreSQL'
                }
            ),
            'icon': forms.TextInput(
                attrs={'class': 'form-control', 'placeholder': 'e.g., 🚀 or 💻'}
            ),
            'live_link': forms.TextInput(attrs={'class': 'form-control'}),
            'github_link': forms.TextInput(attrs={'class': 'form-control'}),
        }
