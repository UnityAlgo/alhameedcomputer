from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .api import LoginAPI, RegisterUserAPIView


urlpatterns = [
    path("api/login", LoginAPI.as_view(), name="login-user"),
    path("api/login/refresh", TokenRefreshView.as_view(), name="refresh-jwt-token"),
    path("api/user/register", RegisterUserAPIView.as_view(), name="register-user"),
]
