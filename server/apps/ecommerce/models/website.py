from django.db import models
from .base import BaseModel


class Store(BaseModel):
    store_name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    locked = models.BooleanField(default=False)
    logo = models.ImageField(upload_to="store/logos/", null=True, blank=True)
    currency = models.CharField(max_length=10, default="USD")

    def __str__(self):
        return super().__str__()


class WebsiteSettings(models.Model):
    store = models.OneToOneField(
        Store, on_delete=models.CASCADE, related_name="website_settings"
    )
    homepage_title = models.CharField(max_length=255, null=True, blank=True)
    homepage_banner = models.ImageField(
        upload_to="website/banners/", null=True, blank=True
    )

    footer_text = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Website Settings for {self.store.store_name}"


class Banner(models.Model):
    # store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="banners")
    image = models.ImageField(upload_to="website/banners/", null=True, blank=True)
    link = models.URLField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    html_content = models.TextField(null=True, blank=True)
    idx = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Banner  {self.idx}"

    def save(self, *args, **kwargs):
        if not self.image and not self.html_content:
            raise ValueError("Either image or html_content must be provided.")

        super().save(*args, **kwargs)
