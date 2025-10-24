from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..authentication import CookieTokenAuthentication
from ..models import UserProfile, GithubAccount
from ..serializers import UserCreateRequestsSerializer

from django.utils import timezone
from rest_framework import viewsets
from django.http import JsonResponse
from rest_framework.decorators import api_view, authentication_classes, permission_classes

from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.conf import settings
import requests
from django.shortcuts import redirect


def github_repos_handler(request):
    try:
        token = request.user.github_account.access_token
    except GithubAccount.DoesNotExist:
        return Response({"error": "GitHub account not linked"}, status=status.HTTP_400_BAD_REQUEST)

    repos = requests.get(
        "https://api.github.com/user/repos",
        headers={"Authorization": f"token {token}"}
    ).json()

    return Response(repos)


def github_callback_handler(request):
    code = request.GET.get('code')
    if not code:
        return Response({"error": "Missing code"}, status=status.HTTP_400_BAD_REQUEST)

    # Exchange the code for an access token
    token_response = requests.post(
        "https://github.com/login/oauth/access_token",
        data={
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
        },
        headers={"Accept": "application/json"},
    )

    token_data = token_response.json()
    access_token = token_data.get("access_token")

    if not access_token:
        return Response({"error": "Failed to retrieve access token"}, status=status.HTTP_400_BAD_REQUEST)

    # Fetch the user's GitHub profile
    user_response = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"token {access_token}"}
    )
    user_data = user_response.json()
    github_username = user_data.get("login")

    if not github_username:
        return Response({"error": "Failed to get GitHub user info"}, status=status.HTTP_400_BAD_REQUEST)

    # Save or update the GitHub account
    GithubAccount.objects.update_or_create(
        user=request.user,
        defaults={
            "access_token": access_token,
            "github_username": github_username
        }
    )

    return redirect("http://localhost:5173")


def auth_check_view(request):
    return Response({
        "authenticated": True,
        "username": request.user.username
    })


def github_login(request):
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={settings.GITHUB_REDIRECT_URI}"
        f"&scope=repo,user"
    )
    return Response({"auth_url": github_auth_url})
