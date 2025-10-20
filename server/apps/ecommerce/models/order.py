from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from .product import Product, BaseModel
from .customer import Customer
from apps.user_auth.models.base import Address
from .product import PriceList


class OrderStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    CONFIRMED = "confirmed", "Confirmed"
    PROCESSING = "processing", "Processing"
    SHIPPED = "shipped", "Shipped"
    DELIVERED = "delivered", "Delivered"
    CANCELED = "canceled", "Canceled"
    REFUNDED = "refunded", "Refunded"


class DeliveryStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    TO_DELIVER = "to_deliver", "To Deliver"
    IN_TRANSIT = "in_transit", "In Transit"
    DELIVERED = "delivered", "Delivered"
    CANCELED = "canceled", "Canceled"


class PaymentMethod(BaseModel):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class ShippingRule(BaseModel):
    name = models.CharField(max_length=255)
    shipping_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    min_order_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Minimum order amount for this shipping rule to apply",
    )
    max_order_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Maximum order amount for this shipping rule (leave blank for no limit)",
    )
    is_active = models.BooleanField(default=True)
    free_shipping_threshold = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Order amount above which shipping is free",
    )

    class Meta:
        ordering = ["min_order_amount"]

    def __str__(self):
        return f"{self.name} - ${self.shipping_amount}"

    # def applies_to_order(self, order_amount):
    #     """Check if this shipping rule applies to the given order amount"""
    #     if not self.is_active:
    #         return False
    #     if order_amount < self.min_order_amount:
    #         return False
    #     if self.max_order_amount and order_amount > self.max_order_amount:
    #         return False
    #     return True

    def calculate_shipping_cost(self):
        return self.shipping_amount


class Order(BaseModel):
    payment_method = models.ForeignKey(
        PaymentMethod,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
    )
    status = models.CharField(
        max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING
    )
    order_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="orders"
    )
    shipping_rule = models.ForeignKey(
        ShippingRule, on_delete=models.SET_NULL, null=True, blank=True
    )
    total_qty = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Subtotal before taxes and shipping",
    )
    shipping_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_taxes_and_charges = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_date = models.DateField(null=True, blank=True)
    order_date = models.DateTimeField(auto_now_add=True)
    delivery_address = models.ForeignKey(
        Address, on_delete=models.SET_NULL, null=True, blank=True
    )
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ["-order_date"]

    def __str__(self):
        return self.order_id or str(self.id)

    def generate_order_id(self):
        count = Order.objects.count() + 1
        return f"ORD-{timezone.now().strftime('%Y%m%d')}-{str(count).zfill(5)}"

    def calculate_shipping(self):
        if not self.shipping_rule:
            return
        self.shipping_charges = self.shipping_rule.calculate_shipping_cost()

    def calculate_total(self):
        self.total_amount = sum(item.amount or 0 for item in self.items.all())
        self.total_qty = sum(item.quantity or 0 for item in self.items.all())

        self.calculate_shipping()

        self.grand_total = (
            self.total_amount
            + self.shipping_charges
            + self.total_taxes_and_charges
            - self.discount_amount
        )

    def save(self, *args, **kwargs):
        if not self.order_id:
            self.order_id = self.generate_order_id()

        if not kwargs.pop("skip_calculation", False) and self.id:
            self.calculate_total()

        super().save(*args, **kwargs)

    def can_create_delivery_note(self):
        return self.status in [
            OrderStatus.CONFIRMED,
            OrderStatus.PROCESSING,
            OrderStatus.SHIPPED,
        ]


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


class DeliveryNote(BaseModel):
    delivery_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="delivery_notes"
    )
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="delivery_notes"
    )
    status = models.CharField(
        max_length=20, choices=DeliveryStatus.choices, default=DeliveryStatus.DRAFT
    )
    delivery_date = models.DateField(null=True, blank=True)
    actual_delivery_date = models.DateTimeField(null=True, blank=True)
    delivery_address = models.ForeignKey(
        Address, on_delete=models.SET_NULL, null=True, blank=True
    )
    tracking_number = models.CharField(max_length=255, null=True, blank=True)
    carrier = models.CharField(max_length=255, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    delivered_by = models.CharField(max_length=255, null=True, blank=True)
    received_by = models.CharField(max_length=255, null=True, blank=True)
    signature = models.ImageField(
        upload_to="delivery_signatures/", null=True, blank=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.delivery_id or str(self.id)

    def generate_delivery_id(self):
        count = DeliveryNote.objects.count() + 1
        return f"DN-{timezone.now().strftime('%Y%m%d')}-{str(count).zfill(5)}"

    def save(self, *args, **kwargs):
        if not self.delivery_id:
            self.delivery_id = self.generate_delivery_id()

        if not self.customer:
            self.customer = self.order.customer

        if not self.delivery_address:
            self.delivery_address = self.order.delivery_address

        super().save(*args, **kwargs)

    def mark_as_delivered(self, delivered_by=None, received_by=None):
        self.status = DeliveryStatus.DELIVERED
        self.actual_delivery_date = timezone.now()
        if delivered_by:
            self.delivered_by = delivered_by
        if received_by:
            self.received_by = received_by
        self.save()

        for item in self.items.all():
            order_item = OrderItem.objects.get(order=self.order, product=item.product)
            order_item.delivered_qty += item.quantity
            order_item.save()

        all_delivered = all(
            item.delivered_qty >= item.quantity for item in self.order.items.all()
        )
        if all_delivered:
            self.order.status = OrderStatus.DELIVERED
            self.order.save()


class DeliveryNoteItem(BaseModel):
    delivery_note = models.ForeignKey(
        DeliveryNote, on_delete=models.CASCADE, related_name="items"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    uom = models.CharField(max_length=50, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ["delivery_note", "product"]

    def __str__(self):
        return f"{self.product.product_name} - {self.quantity} {self.uom or ''}"

    def clean(self):
        try:
            order_item = OrderItem.objects.get(
                order=self.delivery_note.order, product=self.product
            )
            if self.quantity > order_item.pending_qty:
                raise ValidationError(
                    f"Delivery quantity ({self.quantity}) exceeds pending quantity "
                    f"({order_item.pending_qty}) for {self.product.product_name}"
                )
        except OrderItem.DoesNotExist:
            raise ValidationError(f"{self.product.product_name} is not in the order")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
