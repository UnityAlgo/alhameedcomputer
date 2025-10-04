from rest_framework import serializers
from apps.ecommerce.models.category import Category


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "parent", "image", "created_at", "updated_at"]

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        if not request:
            return obj.image.url
        return request.build_absolute_uri(obj.image.url)


class CategoryTreeSerializer(serializers.ModelSerializer):
    """Recursive serializer for Category with children"""
    children = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "parent", "image", "children"]

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        if not request:
            return obj.image.url
        return request.build_absolute_uri(obj.image.url)

    def get_children(self, obj):
        children = Category.objects.filter(parent=obj)
        serializer = CategoryTreeSerializer(children, many=True, context=self.context)
        return serializer.data


class CategoryListSerializer(serializers.Serializer):
    """Serializer for listing all categories in a tree structure"""
    categories = serializers.SerializerMethodField()

    def get_categories(self, obj):
        root_categories = Category.objects.filter(parent=None)
        serializer = CategoryTreeSerializer(root_categories, many=True, context=self.context)
        return serializer.data
