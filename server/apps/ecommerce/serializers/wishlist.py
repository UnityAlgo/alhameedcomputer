from rest_framework import serializers
from apps.ecommerce.models.wishlist import Wishlist
from apps.ecommerce.serializers.product import ProductListSerializer

class WishlistSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "customer", "products"]
        read_only_fields = ["id", "customer", "products"]
