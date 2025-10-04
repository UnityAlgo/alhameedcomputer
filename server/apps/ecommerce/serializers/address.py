from rest_framework import serializers
from apps.user_auth.models.base import Address

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "title",
            "default",
            "address_type",
            "address_line_1",
            "address_line_2",
            "country",
            "state",
            "city",
            "postal_code",
            "email",
            "phone_number",
            "created_at",
        ]
