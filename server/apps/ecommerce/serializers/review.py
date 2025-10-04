from rest_framework import serializers
from apps.ecommerce.models.review import ProductReview

class ProductReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.user.username", read_only=True)

    class Meta:
        model = ProductReview
        fields = ["id", "product", "customer", "customer_name", "rating", "comment", "created_at"]
        read_only_fields = ["id", "customer", "customer_name", "created_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["customer"] = request.user.customer
        return super().create(validated_data)
