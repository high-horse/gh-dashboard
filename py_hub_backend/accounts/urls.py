from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import hello_world, UserViewSet


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns =[
    path('', hello_world, name='hello_world'),
    path('', include(router.urls))
]
