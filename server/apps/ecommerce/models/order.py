from uuid import uuid4
from django.db import models
from django.utils import timezone
from .product import Product, BaseModel
from .customer import Customer
from apps.user_auth.models.base import Address
from .product import PriceList

class OrderStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    SHIPPED = "shipped", "Shipped"
    DELIVERED = "delivered", "Delivered"
    CANCELED = "canceled", "Canceled"


class Order(BaseModel):
    status = models.CharField(
        max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING
    )
    order_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="orders")
    total_qty = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    order_date = models.DateTimeField(auto_now_add=True)
    delivery_address = models.ForeignKey(
        Address, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return f"Order {self.order_id or self.pk} - {self.customer}"

    def generate_order_id(self):
        now = timezone.now()
        date_part = now.strftime("%Y%m%d")
        time_part = now.strftime("%H%M%S")
        customer_suffix = (
            str(self.customer.id)[-4:].zfill(4) if self.customer else str(uuid4())[:4]
        )
        unique_part = str(uuid4())[:4]
        return f"{date_part}-{time_part}-{unique_part}-{customer_suffix}"

    def calculate_total(self):
        self.total_amount = sum(item.amount or 0 for item in self.items.all())
        self.total_qty = sum(item.quantity or 0 for item in self.items.all())

    def save(self, *args, **kwargs):
        if not self.order_id:
            self.order_id = self.generate_order_id()
        self.calculate_total()
        super().save(*args, **kwargs)


class OrderItem(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    quantity = models.DecimalField(default=1, max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    uom = models.CharField(max_length=50, null=True, blank=True)
    price_list = models.ForeignKey(
        PriceList,
        on_delete=models.SET_NULL, 
        related_name="order_items",
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.product.product_name} - {self.quantity} {self.uom or ''}"

    def calculate_total_amount(self):
        if self.price and self.quantity:
            self.amount = self.price * self.quantity
        else:
            self.amount = 0

    def save(self, *args, **kwargs):
        if not self.price:
            self.price = self.product.final_price
        self.calculate_total_amount()
        super().save(*args, **kwargs)
        if self.order:
            self.order.calculate_total()
            self.order.save()
