from django.db import models
from .product import BaseModel


class ShippingRule(BaseModel):
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=100, blank=True, null=True)
    based_on = models.CharField(
        max_length=50,
        choices=[("fixed", "Fixed"), ("weight", "Weight"), ("price", "Price")],
        default="fixed",
    )
    shipping_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name", "is_active"]

    def __str__(self):
        return f"{self.name} - ${self.shipping_amount}"

    def calculate_shipping_cost(self, value=None):
        if self.based_on == "fixed":
            return self.shipping_amount

        conditions = self.conditions.all().order_by("min_value")
        for condition in conditions:
            if condition.min_value <= value or 0 <= condition.max_value:
                return condition.shipping_amount

        return 0


class ShippingRuleCondition(BaseModel):
    min_value = models.DecimalField(max_digits=10, decimal_places=2)
    max_value = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_rule = models.ForeignKey(
        ShippingRule, on_delete=models.CASCADE, related_name="conditions"
    )
    shipping_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.shipping_rule.name}: {self.min_value} - {self.max_value} => {self.shipping_amount}"
