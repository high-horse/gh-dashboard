from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import hello_world, UserViewSet, login_view, logout_view, auth_check_view, github_login, github_callback, github_repos


router = DefaultRouter(trailing_slash=False)
router.register(r'users', UserViewSet, basename='user')

urlpatterns =[
    path('auth-hello', hello_world, name='hello_world'),
    path('', include(router.urls)),
    path('login', login_view, name='login'),
    path('logout', logout_view, name='logout'),
    path('me', auth_check_view, name="auth_check_view_me"),

    path('auth-check', auth_check_view, name="auth_check_view"),

    path('github/login', github_login, name="github_login"),
    path('github/callback/', github_callback, name="github_callback"),
    path('github/repos', github_repos, name="github_repos"),
]
