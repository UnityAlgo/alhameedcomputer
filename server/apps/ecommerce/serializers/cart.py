from rest_framework import serializers
from apps.ecommerce.models.cart import Cart, CartItem
from apps.ecommerce.models.product import Product

class ProductNestedSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(source="cover_image")

    class Meta:
        model = Product
        fields = ["id", "product_name", "image", "description", "category", "price", "final_price"]


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductNestedSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "price", "amount", "subtotal"]

    def get_subtotal(self, obj):
        return obj.price * obj.quantity

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "grand_total", "total_qty", "updated_at", "items"]


class CartItemAddSerializer(serializers.Serializer):
    product_id = serializers.CharField(max_length=255)
    quantity = serializers.IntegerField(min_value=1)

    def validate(self, data):
        if data["quantity"] <= 0:
            raise serializers.ValidationError(
                {"quantity": "Quantity must be greater than zero"}
            )
        if not Product.objects.filter(id=data["product_id"]).exists():
            raise serializers.ValidationError({"product_id": "Invalid product ID"})
        return data


class CartItemUpdateSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1, required=False)
    action = serializers.ChoiceField(choices=["remove", "update"], default="update")

    def validate(self, data):
        if data["action"] == "update" and data.get("quantity") is not None:
            if data["quantity"] < 0:
                raise serializers.ValidationError(
                    {"quantity": "Quantity must be greater than or equal to zero"}
                )
        return data
