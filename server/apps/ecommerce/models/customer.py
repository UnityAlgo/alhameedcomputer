from django.db import models
from django.contrib.auth import get_user_model
from .base import BaseModel


class Customer(BaseModel):
    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="customer"
    )
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )

    def __str__(self):
        return self.user.get_full_name() or self.user.email
    
    @property
    def full_name(self):
        return self.user.get_full_name() or self.user.username



