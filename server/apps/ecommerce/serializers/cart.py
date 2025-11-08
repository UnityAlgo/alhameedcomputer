from rest_framework import serializers
from apps.ecommerce.models.cart import Cart, CartItem
from apps.ecommerce.models.product import Product


class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "qty",
            "price",
            "amount",
        ]

    def get_product(self, obj: CartItem):
        product = obj.product
        cover_image = None
        if product.cover_image:
            cover_image = product.cover_image.url

            if self.context.get("request"):
                if cover_image:
                    cover_image = self.context["request"].build_absolute_uri(
                        cover_image
                    )

        return {
            "id": product.id,
            "product_name": product.product_name,
            "slug": product.slug,
            "cover_image": cover_image,
            "category": {
                "id": product.category.id,
                "name": product.category.name,
            },
        }

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




class CartUpdateSerializer(serializers.Serializer):
    qty = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=True, min_value=0
    )
    product = serializers.CharField(required=True)
    action = serializers.ChoiceField(
        choices=["add", "remove"], required=False, default="add"
    )

class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.CharField(required=True)
    qty = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, default=1
    )

class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=True, min_value=1
    )

