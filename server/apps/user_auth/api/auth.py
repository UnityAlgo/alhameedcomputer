from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.core.mail import EmailMultiAlternatives
from apps.user_auth.utils import generate_otp, generate_hash, get_client_ip
from apps.user_auth.models import User
from django.core.cache import cache
from django.template.loader import render_to_string
from datetime import datetime
from django.contrib.auth.hashers import make_password
from django.conf import settings
import logging


class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, *args, **kwargs):
        request_data: dict = self.request.data

        if not request_data.get("current_password") or not request_data.get(
            "new_password"
        ):
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "provide current and new password"},
            )

        user = authenticate(
            email=self.request.user.email,
            password=request_data.get("current_password"),
        )
        if not user:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "invalid password"},
            )
        user.set_password(request_data.get("new_password"))
        user.save()
        return Response(status=status.HTTP_200_OK)


logger = logging.getLogger(__name__)


class ForgotPasswordAPIView(APIView):
    MAX_EMAIL_ATTEMPTS = 3
    MAX_IP_ATTEMPTS = 5

    def check_rate_limit(self, email: str, ip: str):
        email_key = f"rate_limit_email_{email}"
        ip_key = f"rate_limit_ip_{ip}"

        email_attempts = cache.get(email_key, 0)
        ip_attempts = cache.get(ip_key, 0)

        if email_attempts >= self.MAX_EMAIL_ATTEMPTS:
            return (
                False,
                "Too many requests for this email. Please try again in 1 hour.",
            )

        if ip_attempts >= self.MAX_IP_ATTEMPTS:
            return (
                False,
                "Too many requests from your network. Please try again in 1 hour.",
            )

        return True, ""

    def increment_rate_limit(self, email, ip):
        email_key = f"rate_limit_email_{email}"
        ip_key = f"rate_limit_ip_{ip}"
        email_attempts = cache.get(email_key, 0)
        ip_attempts = cache.get(ip_key, 0)
        print("email attempts", email_attempts)
        print("ip attempts", ip_attempts)
        cache.set(ip_key, ip_attempts + 1, timeout=3600)
        cache.set(email_key, email_attempts + 1, timeout=3600)

    def send_otp_mail(self, otp: str, user: User):
        try:
            template = render_to_string(
                "email/email_otp.html",
                context={
                    "year": datetime.now().strftime("%Y"),
                    "user": user,
                    "otp": otp,
                },
            )
            email = EmailMultiAlternatives(
                "Verify Your Email", "", settings.EMAIL_HOST_USER, [user.email]
            )
            email.attach_alternative(template, "text/html")
            response = email.send()
            logger.info(f"OTP email sent to {user.email}, response: {response}")
            return response > 0
        except Exception as e:
            logger.error(f"Failed to send OTP email to {user.email}: {str(e)}")

    def post(self, *args, **kwargs):
        request_data: dict = self.request.data

        if not request_data.get("email"):
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Email is required"},
            )

        try:
            user = User.objects.get(email=request_data.get("email"))
        except User.DoesNotExist:
            self.increment_rate_limit(
                email=request_data.get("email"), ip=get_client_ip(self.request)
            )
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "invalid email"},
            )
        allowed, err = self.check_rate_limit(
            request_data.get("email"), get_client_ip(self.request)
        )
        if not allowed:
            return Response(status=status.HTTP_429_TOO_MANY_REQUESTS, data={
                "message": err
            })
        otp = generate_otp()
        secret = generate_hash()
        logger.info(f"Generated OTP for {user.email}: secret={secret}")
        cache.set(secret, otp, timeout=300)
        cache.set(
            f"password_reset_{secret}",
            {"otp": otp, "email": user.email, "attempts": 0, "verified": False},
            timeout=300,
        )
        # email_sent = self.send_otp_mail(otp, user)
        email_sent = 1
        if not email_sent:
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                data={
                    "message": "Failed to send verification email. Please try again."
                },
            )

        self.increment_rate_limit(email=user.email, ip=get_client_ip(self.request))
        return Response(
            status=status.HTTP_200_OK, data={"message": "success", "secret": secret}
        )
