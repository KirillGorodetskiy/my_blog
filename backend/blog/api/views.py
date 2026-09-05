from django.contrib.auth import login, logout
from django.db.models import Q, QuerySet
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import (
    csrf_protect,
    ensure_csrf_cookie,
)
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from blog.api.auth import auth_payload
from blog.comments import (
    apply_moderation,
    can_delete_comment,
    enforce_comment_rate,
    reject_duplicate,
    validate_comment_body,
)
from blog.models import (
    Comment,
    CommentStatus,
    Post,
    Project,
)
from blog.api.serializers import (
    ArticleSerializer,
    CommentCreateSerializer,
    CommentSerializer,
    LoginSerializer,
    MeSerializer,
    ProjectSerializer,
    RegisterSerializer,
    SearchArticleSerializer,
    SearchProjectSerializer,
)


def published_posts() -> QuerySet[Post]:
    return (
        Post.objects.filter(is_published=True)
        .prefetch_related('tag')
    )


def published_projects() -> QuerySet[Project]:
    return (
        Project.objects.filter(is_published=True)
        .prefetch_related('screenshots')
    )


class ArticleListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = published_posts()
        featured = request.query_params.get('featured')
        if featured in {'1', 'true', 'True'}:
            queryset = queryset.filter(featured=True)
        serializer = ArticleSerializer(queryset, many=True)
        return Response(serializer.data)


class ArticleDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug: str):
        article = get_object_or_404(published_posts(), slug=slug)
        return Response(ArticleSerializer(article).data)


class ProjectListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = published_projects()
        featured = request.query_params.get('featured')
        if featured in {'1', 'true', 'True'}:
            queryset = queryset.filter(featured=True)
        serializer = ProjectSerializer(queryset, many=True)
        return Response(serializer.data)


class ProjectDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug: str):
        project = get_object_or_404(
            published_projects(),
            slug=slug,
        )
        return Response(ProjectSerializer(project).data)


class SearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'articles': [], 'projects': []})
        posts = published_posts().filter(
            Q(title__icontains=query)
            | Q(excerpt__icontains=query)
            | Q(body__icontains=query)
            | Q(category__icontains=query)
            | Q(tag__name__icontains=query)
        ).distinct()
        projects = published_projects().filter(
            Q(title__icontains=query)
            | Q(description__icontains=query)
            | Q(category__icontains=query)
            | Q(technologies__icontains=query)
            | Q(problem__icontains=query)
            | Q(solution__icontains=query)
        ).distinct()
        return Response({
            'articles': SearchArticleSerializer(
                posts,
                many=True,
            ).data,
            'projects': SearchProjectSerializer(
                projects,
                many=True,
            ).data,
        })


class MeView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return Response(
            MeSerializer(auth_payload(request.user)).data,
        )


@method_decorator(csrf_protect, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        login(request, user)
        return Response(
            auth_payload(user),
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login(request, serializer.validated_data['user'])
        return Response(auth_payload(request.user))


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ArticleCommentListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug: str):
        article = get_object_or_404(published_posts(), slug=slug)
        comments = article.comments.filter(
            status=CommentStatus.APPROVED,
        )
        return Response(
            CommentSerializer(
                comments,
                many=True,
                context={'request': request},
            ).data,
        )

    def post(self, request, slug: str):
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        article = get_object_or_404(published_posts(), slug=slug)
        return _create_comment(
            request,
            post=article,
            project=None,
        )


class ProjectCommentListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug: str):
        project = get_object_or_404(
            published_projects(),
            slug=slug,
        )
        comments = project.comments.filter(
            status=CommentStatus.APPROVED,
        )
        return Response(
            CommentSerializer(
                comments,
                many=True,
                context={'request': request},
            ).data,
        )

    def post(self, request, slug: str):
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        project = get_object_or_404(
            published_projects(),
            slug=slug,
        )
        return _create_comment(
            request,
            post=None,
            project=project,
        )


class CommentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk: int):
        comment = get_object_or_404(Comment, pk=pk)
        if not can_delete_comment(request.user, comment):
            return Response(
                {'detail': 'Not allowed.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def _create_comment(request, post, project):
    serializer = CommentCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    if serializer.validated_data.get('website'):
        return Response(
            {
                'id': 0,
                'author': request.user.username,
                'body': serializer.validated_data['body'],
                'createdAt': None,
                'status': CommentStatus.PENDING,
                'canDelete': False,
            },
            status=status.HTTP_201_CREATED,
        )
    body = validate_comment_body(
        serializer.validated_data['body'],
    )
    enforce_comment_rate(request.user.id)
    reject_duplicate(
        request.user.id,
        body,
        post.pk if post else None,
        project.pk if project else None,
    )
    status_value, reason = apply_moderation(body)
    comment = Comment.objects.create(
        author=request.user,
        post=post,
        project=project,
        body=body,
        status=status_value,
        moderation_reason=reason,
    )
    return Response(
        CommentSerializer(
            comment,
            context={'request': request},
        ).data,
        status=status.HTTP_201_CREATED,
    )
