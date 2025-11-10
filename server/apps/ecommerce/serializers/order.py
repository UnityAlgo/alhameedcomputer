from rest_framework import serializers
from apps.ecommerce.models.order import Order, OrderItem
from apps.ecommerce.serializers.customer import CustomerProfileSerializer
from apps.ecommerce.serializers.product import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField(read_only=True)
    # subtotal = serializers.DecimalField(
    #     source="amount", max_digits=10, decimal_places=2, read_only=True
    # )

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "price", "amount"]

    def get_product(self, obj):
        image = None
        if obj.product.cover_image:
            image = obj.product.cover_image.url

        if image and self.context.get("request"):
            request = self.context["request"]
            image = request.build_absolute_uri(image)

        return {
            "product_name": obj.product.product_name,
            "id": str(obj.product.id),
            "cover_image": image,
        }


class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerProfileSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_id",
            "customer",
            "status",
            "grand_total",
            "total_amount",
            "total_qty",
            "total_taxes_and_charges",
            "payment_method",
            "order_date",
            "items",
        ]
