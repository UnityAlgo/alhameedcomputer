from django.urls import path
from .api import (
    LoginAPI,
    RegisterUserAPIView,
    CookieTokenRefreshView,
    LogoutAPI,
    UserAPIView,
)


urlpatterns = [
    
    path("api/login", LoginAPI.as_view(), name="login-user"),
    path(
        "api/login/refresh", CookieTokenRefreshView.as_view(), name="refresh-jwt-token"
    ),
    path("api/logout", LogoutAPI.as_view(), name="logout-user"),
    path("api/user/register", RegisterUserAPIView.as_view(), name="register-user"),
    path("api/user", UserAPIView.as_view(), name="user-details"),
]
