from rest_framework import serializers
from apps.ecommerce.models.customer import Customer


class CustomerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    full_name = serializers.CharField(source="user.username", required=False)
    phone_number = serializers.CharField(source="user.phone_number", required=False)
    created_at = serializers.DateTimeField(read_only=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Customer
        fields = [
            "id",
            "full_name",
            "email",
            "created_at",
            "profile_picture",
            "phone_number",
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})

        if "username" in user_data:
            instance.user.phone_number = user_data["phone_number"]
            instance.user.username = user_data["username"]
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance
