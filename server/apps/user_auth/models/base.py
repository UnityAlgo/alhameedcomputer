from uuid import uuid4
from django.db import models
from django.contrib.auth import get_user_model


class BaseModel(models.Model):
    id = models.CharField(
        max_length=999, primary_key=True, default=uuid4, editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Address(BaseModel):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=100, null=True, blank=True)
    default = models.BooleanField(default=False, null=True)
    address_type = models.CharField(max_length=50, null=True, blank=True)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    email = models.EmailField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.address_line_1}, {self.city}, {self.state}, {self.country}"

    def save(self, *args, **kwargs):
        if self.default:
            Address.objects.filter(user=self.user, default=True).update(default=False)

        super().save(*args, **kwargs)
