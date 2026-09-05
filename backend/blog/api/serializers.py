from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.urls import reverse
from rest_framework import serializers

from blog.models import (
    Comment,
    Post,
    Project,
    ProjectScreenshot,
)
from blog.reading import reading_time_minutes


User = get_user_model()


def media_url(file_field) -> str:
    if not file_field:
        return ''
    return file_field.url


def split_csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [
        part.strip()
        for part in value.split(',')
        if part.strip()
    ]


def split_lines(value: str) -> list[str]:
    return [
        part.strip()
        for part in value.splitlines()
        if part.strip()
    ]


def tag_names(obj: Post) -> list[str]:
    return [tag.name for tag in obj.tag.all()]


def staff_change_url(
    serializer,
    viewname: str,
    pk: int,
    perm: str,
):
    request = serializer.context.get('request')
    user = getattr(request, 'user', None)
    if (
        user is None
        or not user.is_authenticated
        or not user.has_perm(perm)
    ):
        return None
    return reverse(viewname, args=[pk])


class ArticleListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name')
    date = serializers.SerializerMethodField()
    readTimeMinutes = serializers.SerializerMethodField()
    excerpt = serializers.CharField()
    image = serializers.SerializerMethodField()
    featured = serializers.BooleanField()
    tags = serializers.SerializerMethodField()
    adminUrl = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'slug',
            'title',
            'category',
            'date',
            'readTimeMinutes',
            'excerpt',
            'image',
            'featured',
            'tags',
            'adminUrl',
        )

    def get_date(self, obj: Post) -> str:
        stamp = obj.published_at or obj.created_at
        return stamp.date().isoformat()

    def get_readTimeMinutes(self, obj: Post) -> int:
        return reading_time_minutes(obj.body)

    def get_image(self, obj: Post) -> str:
        return media_url(obj.image)

    def get_tags(self, obj: Post) -> list[str]:
        return tag_names(obj)

    def get_adminUrl(self, obj: Post) -> str | None:
        return staff_change_url(
            self,
            'admin:blog_post_change',
            obj.pk,
            'blog.change_post',
        )


class ArticleDetailSerializer(ArticleListSerializer):
    body = serializers.CharField()

    class Meta(ArticleListSerializer.Meta):
        fields = ArticleListSerializer.Meta.fields + (
            'body',
        )


class ArticleSerializer(ArticleDetailSerializer):
    pass


class ScreenshotSerializer(serializers.ModelSerializer):
    src = serializers.SerializerMethodField()

    class Meta:
        model = ProjectScreenshot
        fields = ('src', 'alt', 'caption')

    def get_src(self, obj: ProjectScreenshot) -> str:
        return media_url(obj.image)


class ProjectListSerializer(serializers.ModelSerializer):
    category = serializers.CharField()
    description = serializers.CharField()
    image = serializers.SerializerMethodField()
    featured = serializers.BooleanField()
    status = serializers.CharField()
    technologies = serializers.SerializerMethodField()
    adminUrl = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'slug',
            'title',
            'category',
            'description',
            'image',
            'featured',
            'status',
            'technologies',
            'adminUrl',
        )

    def get_image(self, obj: Project) -> str:
        return media_url(obj.image)

    def get_technologies(self, obj: Project) -> list[str]:
        return split_csv(obj.technologies)

    def get_adminUrl(self, obj: Project) -> str | None:
        return staff_change_url(
            self,
            'admin:blog_project_change',
            obj.pk,
            'blog.change_project',
        )


class ProjectDetailSerializer(ProjectListSerializer):
    problem = serializers.CharField()
    solution = serializers.CharField()
    architecture = serializers.CharField()
    workflow = serializers.CharField()
    integrations = serializers.CharField()
    failureHandling = serializers.CharField(
        source='failure_handling',
    )
    screenshots = ScreenshotSerializer(many=True)
    lessons = serializers.SerializerMethodField()
    githubUrl = serializers.SerializerMethodField()
    demoUrl = serializers.SerializerMethodField()

    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + (
            'problem',
            'solution',
            'architecture',
            'workflow',
            'integrations',
            'failureHandling',
            'screenshots',
            'lessons',
            'githubUrl',
            'demoUrl',
        )

    def get_lessons(self, obj: Project) -> list[str]:
        return split_lines(obj.lessons)

    def get_githubUrl(self, obj: Project) -> str | None:
        return obj.github_link or None

    def get_demoUrl(self, obj: Project) -> str | None:
        return obj.live_link or None


class ProjectSerializer(ProjectDetailSerializer):
    pass


class SearchArticleSerializer(serializers.ModelSerializer):
    excerpt = serializers.CharField()
    category = serializers.CharField(source='category.name')
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('slug', 'title', 'excerpt', 'category', 'tags')

    def get_tags(self, obj: Post) -> list[str]:
        return tag_names(obj)


class SearchProjectSerializer(serializers.ModelSerializer):
    technologies = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'slug',
            'title',
            'description',
            'category',
            'technologies',
        )

    def get_technologies(self, obj: Project) -> list[str]:
        return split_csv(obj.technologies)


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username')
    createdAt = serializers.DateTimeField(source='created_at')
    canDelete = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = (
            'id',
            'author',
            'body',
            'createdAt',
            'status',
            'canDelete',
        )

    def get_canDelete(self, obj: Comment) -> bool:
        from blog.comments import can_delete_comment

        request = self.context.get('request')
        if request is None:
            return False
        return can_delete_comment(request.user, obj)


class CommentCreateSerializer(serializers.Serializer):
    body = serializers.CharField()
    website = serializers.CharField(
        required=False,
        allow_blank=True,
        default='',
    )


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    passwordConfirm = serializers.CharField(write_only=True)
    turnstileToken = serializers.CharField(
        write_only=True,
        allow_blank=True,
    )

    def validate_username(self, value: str) -> str:
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                'Username is already taken.',
            )
        return value

    def validate_email(self, value: str) -> str:
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                'Email is already registered.',
            )
        return value

    def validate(self, attrs):
        from blog.turnstile import verify_turnstile

        token = attrs.pop('turnstileToken')
        if attrs['password'] != attrs['passwordConfirm']:
            raise serializers.ValidationError(
                {'passwordConfirm': 'Passwords do not match.'},
            )
        validate_password(attrs['password'])
        if not token:
            raise serializers.ValidationError(
                {'turnstileToken': 'Turnstile token is required.'},
            )
        verify_turnstile(token)
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            username=attrs['username'],
            password=attrs['password'],
        )
        if user is None:
            raise serializers.ValidationError(
                'Invalid username or password.',
            )
        if not user.is_active:
            raise serializers.ValidationError(
                'This account is inactive.',
            )
        attrs['user'] = user
        return attrs


class MeSerializer(serializers.Serializer):
    isAuthenticated = serializers.BooleanField()
    username = serializers.CharField(allow_null=True)
    email = serializers.CharField(allow_null=True)
    isStaff = serializers.BooleanField()
    isSuperuser = serializers.BooleanField()
