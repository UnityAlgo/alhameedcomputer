from django.db import models
from . import BaseModel
from .customer import Customer
from .product import Product


class Cart(BaseModel):
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="carts"
    )
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_qty = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.customer.user.email 

    def calculate_totals(self):
        self.grand_total = sum(item.amount for item in self.items.all())
        self.total_qty = sum(item.quantity for item in self.items.all())

    def save(self, *args, **kwargs):
        self.calculate_totals()
        super().save(*args, **kwargs)

    def add_item(self, product, quantity, price=None):
        if not price: 
            price = product.final_price

        item, created = CartItem.objects.get_or_create(
            cart=self,
            product=product,
            defaults={"quantity": quantity, "price": price},
        )

        if not created:
            item.quantity += quantity
            item.save()

        self.calculate_totals()
        self.save()


class CartItem(BaseModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="cart_items"
    )
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.product_name} - {self.quantity}"

    def calculate_total_amount(self):
        self.amount = self.price * self.quantity

    def save(self, *args, **kwargs):
        if not self.price: 
            self.price = self.product.final_price
        self.calculate_total_amount()
        super().save(*args, **kwargs)
