import uuid
from django.db import models
from apps.ecommerce.models.product import Product
from apps.ecommerce.models.customer import Customer
from apps.ecommerce.models.base import BaseModel

class ProductReview(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ("product", "customer")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.customer.user.username} → {self.product.product_name} ({self.rating})"
