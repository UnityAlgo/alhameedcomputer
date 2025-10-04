# from rest_framework import serializers
# from apps.ecommerce.models.customer import Customer

# class CustomerProfileSerializer(serializers.ModelSerializer):
#     email = serializers.EmailField(source="user.email", read_only=True)
#     full_name = serializers.CharField(source="user.username", required=False)
#     created_at = serializers.DateTimeField(read_only=True)
#     profile_picture = serializers.ImageField(required=False, allow_null=True)

#     class Meta:
#         model = Customer
#         fields = [
#             "id",
#             "full_name",
#             "email",
#             "phone_number",
#             "created_at",
#             "profile_picture",
#         ]

#     def get_full_name(self, obj):
#         return obj.user.get_full_name() or obj.user.username

from rest_framework import serializers
from apps.ecommerce.models.customer import Customer

class CustomerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    full_name = serializers.CharField(source="user.username", required=False)
    created_at = serializers.DateTimeField(read_only=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Customer
        fields = [
            "id",
            "full_name",
            "email",
            "phone_number",
            "created_at",
            "profile_picture",
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        
        if "username" in user_data:
            instance.user.username = user_data["username"]
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance

    