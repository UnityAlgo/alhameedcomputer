from uuid import uuid4
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.http import HttpRequest


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    id = models.CharField(
        default=uuid4, primary_key=True, editable=False, unique=True, max_length=999
    )
    updated_at = models.DateTimeField(auto_now=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    email = models.EmailField(unique=True)
    dob = models.DateField(null=True, blank=True)
    username = models.CharField(max_length=50, unique=False, null=False)
    mobile = models.CharField(max_length=50, unique=True, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)

    two_factor_enabled = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self) -> str:
        return str(self.email)

    def create_login_activity(
        self, request: HttpRequest, successful: bool = True
    ) -> "LoginActivity":
        ip_address = (request.META.get("REMOTE_ADDR", ""),)
        user_agent = (request.META.get("HTTP_USER_AGENT", ""),)
        location = (request.META.get("GEOIP_CITY", ""),)
        device = (request.META.get("DEVICE_TYPE", ""),)

        activity = LoginActivity.objects.create(
            user=self,
            ip_address=ip_address,
            user_agent=user_agent,
            device=device,
            location=location,
            successful=successful,
        )
        return activity


class LoginActivity(models.Model):
    id = models.CharField(
        default=uuid4, primary_key=True, editable=False, unique=True, max_length=999
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    successful = models.BooleanField(default=True)
    device = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self) -> str:
        return f"LoginActivity for {self.user.email} at {self.timestamp}"

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["user", "timestamp"]),
        ]
