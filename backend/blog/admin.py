from django.contrib import admin

from blog.branding import (
    ADMIN_INDEX_TITLE,
    ADMIN_SITE_HEADER,
    ADMIN_SITE_TITLE,
)
from blog.models import (
    Comment,
    ModerationTerm,
    Post,
    PostCategory,
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
        'title',
        'slug',
        'category',
        'featured',
        'project',
        'is_published',
        'published_at',
        'created_at',
        'updated_at',
    )
    list_display_links = ('title',)
    list_filter = (
        'is_published',
        'featured',
        'category',
        'created_at',
        'project',
    )
    search_fields = (
        'title',
        'slug',
        'excerpt',
        'body',
        'category__name',
        'project__title',
    )
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
        'title',
        'slug',
        'category',
        'status',
        'featured',
        'is_published',
        'published_at',
        'created_at',
        'updated_at',
    )
    list_display_links = ('title',)
    list_filter = (
        'is_published',
        'featured',
        'category',
        'status',
    )
    search_fields = (
        'title',
        'slug',
        'description',
        'technologies',
    )
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    inlines = [ProjectScreenshotInline]
    fieldsets = (
        ('Basic', {
            'fields': (
                'title',
                'slug',
                'category',
                'status',
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


@admin.register(PostCategory)
class PostCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)


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
        'author',
        'status',
        'post',
        'project',
        'created_at',
        'moderation_reason',
    )
    list_display_links = ('author',)
    list_filter = ('status', 'created_at')
    search_fields = (
        'body',
        'author__username',
        'post__title',
        'project__title',
    )
    list_select_related = ('author', 'post', 'project')
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


admin.site.site_header = ADMIN_SITE_HEADER
admin.site.site_title = ADMIN_SITE_TITLE
admin.site.index_title = ADMIN_INDEX_TITLE
