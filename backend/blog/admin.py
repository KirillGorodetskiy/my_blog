from django.contrib import admin

from blog.models import (
    Comment,
    ModerationTerm,
    Post,
    Project,
    ProjectScreenshot,
    Tag,
)


class ProjectScreenshotInline(admin.TabularInline):
    model = ProjectScreenshot
    extra = 1
    fields = ('image', 'alt', 'caption', 'sort_order')


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'category',
        'featured',
        'project',
        'is_published',
        'published_at',
        'created_at',
    )
    list_filter = (
        'is_published',
        'featured',
        'category',
        'created_at',
        'project',
    )
    search_fields = ('title', 'excerpt', 'body', 'project__title')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    fieldsets = (
        ('Basics', {
            'fields': (
                'title',
                'slug',
                'category',
                'excerpt',
                'featured',
            ),
        }),
        ('Publication', {
            'fields': ('is_published', 'published_at'),
        }),
        ('Content', {
            'fields': ('body', 'image'),
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
    filter_horizontal = ('tag',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'category',
        'status',
        'featured',
        'is_published',
        'published_at',
    )
    list_filter = (
        'is_published',
        'featured',
        'category',
        'status',
    )
    search_fields = ('title', 'description', 'technologies')
    date_hierarchy = 'created_at'
    inlines = [ProjectScreenshotInline]
    fieldsets = (
        ('Basic', {
            'fields': (
                'title',
                'slug',
                'category',
                'status',
                'icon',
            ),
        }),
        ('Publication', {
            'fields': ('is_published', 'featured', 'published_at'),
        }),
        ('Summary', {
            'fields': ('description',),
        }),
        ('Case Study', {
            'fields': (
                'problem',
                'solution',
                'architecture',
                'workflow',
                'integrations',
                'failure_handling',
                'lessons',
            ),
        }),
        ('Technologies', {
            'fields': ('technologies',),
        }),
        ('Links', {
            'fields': ('live_link', 'github_link'),
        }),
        ('Media', {
            'fields': ('image',),
        }),
        ('Meta', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    readonly_fields = ('created_at', 'updated_at', 'published_at')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.action(description='Approve selected comments')
def approve_comments(modeladmin, request, queryset):
    queryset.update(status='approved', moderation_reason='')


@admin.action(description='Reject selected comments')
def reject_comments(modeladmin, request, queryset):
    queryset.update(
        status='rejected',
        moderation_reason='rejected by admin',
    )


@admin.action(description='Mark selected comments as spam')
def mark_spam_comments(modeladmin, request, queryset):
    queryset.update(
        status='spam',
        moderation_reason='marked as spam',
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'author',
        'status',
        'post',
        'project',
        'created_at',
        'moderation_reason',
    )
    list_filter = ('status', 'author', 'created_at')
    search_fields = ('body', 'author__username')
    date_hierarchy = 'created_at'
    actions = (
        approve_comments,
        reject_comments,
        mark_spam_comments,
    )
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ModerationTerm)
class ModerationTermAdmin(admin.ModelAdmin):
    list_display = ('term', 'is_active', 'action')
    list_filter = ('is_active', 'action')
    search_fields = ('term',)
