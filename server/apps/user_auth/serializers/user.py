from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from ..models import User


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    def get_full_name(self, user):
        return f"{user.first_name} {user.last_name}"

    def get_image(self, user):
        request = self.context.get("request")
        if user.image and request:
            return request.build_absolute_uri(user.image.url)
        return None

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "full_name",
            "username",
            "email",
            "password",
            "mobile",
            "image",
            "created_at",
            "dob",
        ]
        extra_kwargs = {"password": {"write_only": True}}
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        user = User.objects.create(**validated_data)
        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "username",
            "mobile",
            "image",
            "dob",
        ]
        extra_kwargs = {"mobile": {"validators": []}, "image": {"validators": []}}

    def update(self, instance, validated_data):
        print(validated_data)
        validated_data.pop("password", None)
        if "image" in validated_data and validated_data["image"] is None:
            validated_data.pop("image")

        return super().update(instance, validated_data)
