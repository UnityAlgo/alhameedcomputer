from django.urls import path

from .api import (
    ForgotPasswordAPIView,
    LoginAPI,
    RegisterUserAPIView,
    CookieTokenRefreshView,
    LogoutAPI,
    ResetPasswordAPIView,
    VerifyOTPAPIView,
    UserAPIView,
    ChangePasswordAPIView,
)


urlpatterns = [
    path("api/login", LoginAPI.as_view(), name="login-user"),
    path(
        "api/login/refresh", CookieTokenRefreshView.as_view(), name="refresh-jwt-token"
    ),
    path("api/logout", LogoutAPI.as_view(), name="logout-user"),
    path(
        "api/user/auth/change-password",
        ChangePasswordAPIView.as_view(),
        name="change-password",
    ),
    path(
        "api/user/auth/forgot-password",
        ForgotPasswordAPIView.as_view(),
        name="forgot-password",
    ),
    path("api/user/auth/forgot-password/verify", VerifyOTPAPIView.as_view()),
    path(
        "api/user/auth/forgot-password/reset-password", ResetPasswordAPIView.as_view()
    ),
    path("api/user/register", RegisterUserAPIView.as_view(), name="register-user"),
    path("api/user", UserAPIView.as_view()),
    path(
        "api/auth/password/change/",
        ChangePasswordAPIView.as_view(),
        name="password-change",
    ),
    path(
        "api/auth/password/forgot/",
        ForgotPasswordAPIView.as_view(),
        name="password-forgot",
    ),
    path(
        "api/auth/password/verify-otp/",
        VerifyOTPAPIView.as_view(),
        name="password-verify-otp",
    ),
    path(
        "api/auth/password/reset/",
        ResetPasswordAPIView.as_view(),
        name="password-reset",
    ),
]
