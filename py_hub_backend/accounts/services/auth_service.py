from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

def login_view_handler(request):
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


def logout_view_handler(request):
    try:
        request.user.auth_token.delete()
    except Token.DoesNotExist:
        pass
    response = Response({
        "message": "Logged Out Successfully."
    }, status=status.HTTP_200_OK)
    response.delete_cookie('auth_token')
    return response

def auth_check_view_handler(request):
    return Response({
        "authenticated": True,
        "username": request.user.username
    })