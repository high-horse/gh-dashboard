from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .authentication import CookieTokenAuthentication
from .models import UserProfile, GithubAccount
from.serializers import UserCreateRequestsSerializer
from django.utils import timezone
from rest_framework import viewsets
from django.http import JsonResponse
from rest_framework.decorators import api_view, authentication_classes, permission_classes

from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.conf import settings
import requests
from django.shortcuts import redirect
from accounts import services

# Create your views here.
@api_view(['GET'])
@authentication_classes([CookieTokenAuthentication])
@permission_classes([IsAuthenticated])
def hello_world(request):
    return Response({"message": "hello world"}, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    # queryset = UserProfile.objects.filter(deleted_at__isnull=True)
    queryset = UserProfile.active.all()
    serializer_class = UserCreateRequestsSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted_at = timezone.now()  # instance here is UserProfile, so no need for .userprofile
        instance.save()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)


@api_view(['POST'])
def login_view(request):
    # return services.login_view_handler(request)
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        token, created = Token.objects.get_or_create(user=user)

        response = Response({
            "message": "Login successful.",
            "token": token.key
        }, status=status.HTTP_200_OK)

        response.set_cookie(key='auth_token', value=token.key, httponly=True, samesite='Lax' )
        return response
    else:
        return Response({"message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@authentication_classes([CookieTokenAuthentication])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except Token.DoesNotExist:
        pass
    response = Response({
        "message": "Logged Out Successfully."
    }, status=status.HTTP_200_OK)
    response.delete_cookie('auth_token')
    return response

@api_view(['GET'])
@authentication_classes([CookieTokenAuthentication])
@permission_classes([IsAuthenticated])
def auth_check_view(request):
    return Response({
        "authenticated": True,
        "username": request.user.username
    })

@api_view(["GET"])
@authentication_classes([CookieTokenAuthentication])
@permission_classes([IsAuthenticated])
def github_login(request):
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={settings.GITHUB_REDIRECT_URI}"
        f"&scope=repo,user"
    )
    return Response({"auth_url": github_auth_url})


@api_view(["GET"])
@authentication_classes([CookieTokenAuthentication])
@permission_classes([IsAuthenticated])
def github_callback(request):
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def github_callback_(request):
    code = request.GET.get('code')
    if not code:
        return Response({"error": "Missing code"}, status=status.HTTP_400_BAD_REQUEST)

    token_response = request.post(
        "https://github.com/login/oauth/access_token",
        data = {
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

    github_username = request.get("login")

    GithubAccount.objects.update_or_create(
        user = request.user,
        defaults={
            "access_token": access_token,
            "github_username" : github_username
        }
    )

    return Response({
        "message": "GitHub account linked successfully.",
        "github_username": github_username
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([CookieTokenAuthentication])
@permission_classes([IsAuthenticated])
def github_repos(request):
    try:
        token = request.user.github_account.access_token
    except GithubAccount.DoesNotExist:
        return Response({"error": "GitHub account not linked"}, status=status.HTTP_400_BAD_REQUEST)

    repos = requests.get(
        "https://api.github.com/user/repos",
        headers={"Authorization": f"token {token}"}
    ).json()

    return Response(repos)

# def linked_accounts(request) :
#     try:
#         GithubAccount.objects.get()