# admin.py
from django.contrib import admin
from .models import Post, Project, Tag

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    # List page (table)
    list_display = (
        'id',
        'title',
        'project',
        'is_published',
        'published_at',
        'created_at'
    )
    list_filter = ('is_published', 'created_at', 'project')
    search_fields = ('title', 'body', 'project__title')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    # Edit page (form) — this is what changes the layout
    fieldsets = (
        ('Basics', {
            'fields': ('title', 'slug', 'is_published', 'published_at'),
        }),
        ('Content', {
            'fields': ('body',),
        }),
        ('Relations', {
            'fields': ('project', 'tag'),
        }),
        ('Meta', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    readonly_fields = ('created_at', 'updated_at', 'published_at')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tag',)  # nicer ManyToMany chooser

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'created_at', 'published_at')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'
    fieldsets = (
        ('Basics', {'fields': ('title', 'slug', 'icon')}),
        ('Links',  {'fields': ('live_link', 'github_link')}),
        ('Details',{'fields': ('description', 'technologies')}),
        ('Meta',   {'fields': ('created_at', 'updated_at', 'published_at'), 'classes': ('collapse',)}),
    )
    readonly_fields = ('created_at', 'updated_at', 'published_at')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
