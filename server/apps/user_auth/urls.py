from django.urls import path
from apps.user_auth.api.login import LoginAPI
from apps.user_auth.api.register import RegisterAPI
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("api/register/", RegisterAPI.as_view(), name="register"),
    path("api/login", LoginAPI.as_view(), name="login"),
    path("api/login/refresh/", TokenRefreshView.as_view(), name="refresh-jwt-token"),

]