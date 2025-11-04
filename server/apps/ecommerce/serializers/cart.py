from rest_framework import serializers
from apps.ecommerce.models.cart import Cart, CartItem
from apps.ecommerce.models.product import Product


class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.CharField(source="product.id", read_only=True)
    product_name = serializers.CharField(source="product.product_name", read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product_id",
            "product_name",
            "product_image",
            "quantity",
            "price",
            "amount",
        ]

    def get_product_image(self, obj):
        if obj.product.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.product.image.url)
        return None


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.CharField(required=True)
    quantity = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, default=1
    )

    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value)
            if not product.in_stock:
                raise serializers.ValidationError("Product is out of stock")
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found")


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=True, min_value=1
    )


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = [
            "id",
            "grand_total",
            "total_amount",
            "total_qty",
            "updated_at",
            "items",
        ]
