from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from django.core.cache import cache
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.hashers import make_password
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def get_client_ip(request):
    """Extract client IP address from request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class ForgotPasswordAPIView(APIView):
    """
    API endpoint for handling forgot password requests.
    Sends OTP via email for password reset verification.
    """
    
    MAX_EMAIL_ATTEMPTS = 3  # Max requests per email per hour
    MAX_IP_ATTEMPTS = 5  # Max requests per IP per hour
    
    def check_rate_limit(self, email: str, ip: str):
        """
        Check if user/IP has exceeded rate limits.
        
        Returns:
            tuple: (is_allowed: bool, error_message: str)
        """
        email_key = f"rate_limit_email_{email}"
        ip_key = f"rate_limit_ip_{ip}"
        
        email_attempts = cache.get(email_key, 0)
        ip_attempts = cache.get(ip_key, 0)
        
        if email_attempts >= self.MAX_EMAIL_ATTEMPTS:
            return False, "Too many requests for this email. Please try again in 1 hour."
        
        if ip_attempts >= self.MAX_IP_ATTEMPTS:
            return False, "Too many requests from your network. Please try again in 1 hour."
        
        return True, ""
    
    def increment_rate_limit(self, email: str, ip: str):
        """Increment rate limit counters."""
        email_key = f"rate_limit_email_{email}"
        ip_key = f"rate_limit_ip_{ip}"
        
        email_attempts = cache.get(email_key, 0)
        ip_attempts = cache.get(ip_key, 0)
        
        cache.set(email_key, email_attempts + 1, timeout=3600)  # 1 hour
        cache.set(ip_key, ip_attempts + 1, timeout=3600)  # 1 hour
    
    def send_otp_mail(self, otp: str, user):
        """
        Send OTP verification email to user.
        
        Args:
            otp: One-time password string
            user: User instance
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            template = render_to_string(
                "email/email_otp.html",
                context={
                    "year": datetime.now().strftime("%Y"),
                    "user": user,
                    "otp": otp
                },
            )
            
            email = EmailMultiAlternatives(
                subject="Password Reset Verification",
                body="",
                from_email=settings.EMAIL_HOST_USER,
                to=[user.email]
            )
            email.attach_alternative(template, "text/html")
            response = email.send()
            
            logger.info(f"OTP email sent to {user.email}, response: {response}")
            return response > 0
            
        except Exception as e:
            logger.error(f"Failed to send OTP email to {user.email}: {str(e)}")
            return False

    def post(self, request, *args, **kwargs):
        """
        Handle POST request for forgot password.
        
        Request body:
            email (str): User's email address
            
        Returns:
            Response with secret key for OTP verification
        """
        request_data = request.data
        email = request_data.get("email", "").strip().lower()
        client_ip = get_client_ip(request)

        # Validate email presence
        if not email:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Email is required"}
            )
        
        # Check rate limits
        is_allowed, error_message = self.check_rate_limit(email, client_ip)
        if not is_allowed:
            return Response(
                status=status.HTTP_429_TOO_MANY_REQUESTS,
                data={"message": error_message}
            )

        # Check if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Still increment rate limit to prevent email enumeration
            self.increment_rate_limit(email, client_ip)
            # Return generic message for security
            return Response(
                status=status.HTTP_200_OK,
                data={"message": "If the email exists, you will receive an OTP"}
            )

        # Generate OTP and secret
        otp = generate_otp()
        secret = generate_hash()
        
        logger.info(f"Generated OTP for {email}: secret={secret}")

        # Store OTP in cache with 5 minute expiration
        cache.set(
            f"password_reset_{secret}",
            {
                "otp": otp,
                "email": email,
                "attempts": 0,
                "verified": False
            },
            timeout=300
        )

        # Send OTP email
        email_sent = self.send_otp_mail(otp, user)
        
        if not email_sent:
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                data={"message": "Failed to send verification email. Please try again."}
            )
        
        # Increment rate limit after successful send
        self.increment_rate_limit(email, client_ip)

        return Response(
            status=status.HTTP_200_OK,
            data={
                "message": "Verification code sent to your email",
                "secret": secret,
                "expires_in": 300  # 5 minutes in seconds
            }
        )


class VerifyOTPAPIView(APIView):
    """
    API endpoint for verifying OTP.
    """
    
    MAX_OTP_ATTEMPTS = 3  # Max wrong OTP attempts per secret
    
    def post(self, request, *args, **kwargs):
        """
        Verify OTP against secret.
        
        Request body:
            secret (str): Secret key from forgot password request
            otp (str): OTP code received via email
            
        Returns:
            Response with verification status
        """
        request_data = request.data
        secret = request_data.get("secret", "").strip()
        otp = request_data.get("otp", "").strip()
        
        # Validate input
        if not secret or not otp:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Secret and OTP are required"}
            )
        
        # Retrieve cached data
        cache_key = f"password_reset_{secret}"
        cached_data = cache.get(cache_key)
        
        if not cached_data:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Invalid or expired secret. Please request a new OTP."}
            )
        
        # Check if already verified
        if cached_data.get("verified"):
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "This OTP has already been used"}
            )
        
        # Check attempts
        attempts = cached_data.get("attempts", 0)
        if attempts >= self.MAX_OTP_ATTEMPTS:
            cache.delete(cache_key)
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Maximum verification attempts exceeded. Please request a new OTP."}
            )
        
        # Verify OTP
        if cached_data.get("otp") != otp:
            # Increment attempts
            cached_data["attempts"] = attempts + 1
            remaining_attempts = self.MAX_OTP_ATTEMPTS - cached_data["attempts"]
            
            # Update cache
            ttl = cache.ttl(cache_key)
            if ttl:
                cache.set(cache_key, cached_data, timeout=ttl)
            
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    "message": f"Invalid OTP. {remaining_attempts} attempts remaining.",
                    "remaining_attempts": remaining_attempts
                }
            )
        
        # OTP is valid - mark as verified
        cached_data["verified"] = True
        ttl = cache.ttl(cache_key)
        if ttl:
            cache.set(cache_key, cached_data, timeout=ttl)
        
        logger.info(f"OTP verified successfully for email: {cached_data.get('email')}")
        
        return Response(
            status=status.HTTP_200_OK,
            data={
                "message": "OTP verified successfully",
                "secret": secret  # Return secret for password reset
            }
        )


class ResetPasswordAPIView(APIView):
    """
    API endpoint for resetting password after OTP verification.
    """
    
    def post(self, request, *args, **kwargs):
        """
        Reset user password.
        
        Request body:
            secret (str): Verified secret key
            new_password (str): New password
            confirm_password (str): Password confirmation
            
        Returns:
            Response with reset status
        """
        request_data = request.data
        secret = request_data.get("secret", "").strip()
        new_password = request_data.get("new_password", "")
        confirm_password = request_data.get("confirm_password", "")
        
        # Validate input
        if not secret:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Secret is required"}
            )
        
        if not new_password or not confirm_password:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Both password fields are required"}
            )
        
        # Check password match
        if new_password != confirm_password:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Passwords do not match"}
            )
        
        # Validate password strength
        if len(new_password) < 8:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Password must be at least 8 characters long"}
            )
        
        # Retrieve cached data
        cache_key = f"password_reset_{secret}"
        cached_data = cache.get(cache_key)
        
        if not cached_data:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Invalid or expired secret"}
            )
        
        # Check if OTP was verified
        if not cached_data.get("verified"):
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Please verify OTP before resetting password"}
            )
        
        # Get user and update password
        email = cached_data.get("email")
        try:
            user = User.objects.get(email=email)
            user.password = make_password(new_password)
            user.save()
            
            # Delete the cache entry
            cache.delete(cache_key)
            
            logger.info(f"Password reset successfully for user: {email}")
            
            return Response(
                status=status.HTTP_200_OK,
                data={"message": "Password reset successfully. You can now login with your new password."}
            )
            
        except User.DoesNotExist:
            logger.error(f"User not found during password reset: {email}")
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "User not found"}
            )
        except Exception as e:
            logger.error(f"Error resetting password for {email}: {str(e)}")
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                data={"message": "An error occurred. Please try again."}
            )