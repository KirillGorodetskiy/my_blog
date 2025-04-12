from django.db import models

# Create your models here.


class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f' (Post # {self.id})   {self.title}'


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    live_link = models.URLField(max_length=200, blank=True, null=True)
    github_link = models.URLField(max_length=200, blank=True, null=True)
    added_at = models.DateTimeField(auto_now_add=True)
    icon = models.CharField(max_length=10, default="📁")
