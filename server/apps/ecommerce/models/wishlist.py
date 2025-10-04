import uuid
from django.db import models
from apps.ecommerce.models.base import BaseModel
from apps.ecommerce.models.customer import Customer
from apps.ecommerce.models.product import Product

class Wishlist(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE, related_name="wishlist")
    products = models.ManyToManyField(Product, related_name="wishlisted_by", blank=True)

    def __str__(self):
        return f"Wishlist of {self.customer.user.username}"
