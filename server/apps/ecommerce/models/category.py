from django.db import models
from .base import BaseModel


class Category(BaseModel):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="categories/", null=True, blank=True)

    def __str__(self):
        return self.name
