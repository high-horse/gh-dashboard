from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile
from.serializers import UserCreateRequestsSerializer
from django.utils import timezone
from rest_framework import viewsets
from django.http import JsonResponse
from rest_framework.decorators import api_view


# Create your views here.
@api_view(['GET'])
def hello_world(request):
    return Response({"message": "hello world"}, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.filter(deleted_at__isnull=True)
    serializer_class = UserCreateRequestsSerializer
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted_at = timezone.now()  # instance here is UserProfile, so no need for .userprofile
        instance.save()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)
    

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    from django.contrib.auth import authenticate
    user = authenticate(username=username, password=password)
    
    if user is not None:
        return Response({"message": "Login successful."}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['POST'])
def logout_view(request):
    # In a real application, you would handle token invalidation or session termination here.
    return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)