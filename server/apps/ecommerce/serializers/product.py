from rest_framework import serializers
from apps.ecommerce.models.product import Product, UOM, Brand
from apps.ecommerce.models.category import Category
from apps.ecommerce.serializers.category import CategorySerializer


class BrandSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ["id", "name", "description", "image"]

    def get_image(self, obj: Brand):
        if not obj.image:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    media = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    meta_data = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "product_name",
            "slug",
            "short_description",
            "description",
            "category",
            "brand",
            "price",
            "is_listing_item",
            "rating",
            "cover_image",
            "media",
            "created_at",
            "updated_at",
            "meta_data",
        ]

    def get_meta_data(self, obj: Product):
        return {
            "description": obj.meta_description,
            "title": obj.meta_title,
            "keywords": obj.meta_keywords,
        }

    def get_media(self, obj: Product):
        request = self.context.get("request")
        media = []
        for i in obj.images.all():
            if not i.image and not i.video:
                continue
            url = (
                request.build_absolute_uri(i.image.url)
                if request
                else i.image.url
            )
            media.append(url)

        return media

    def get_cover_image(self, obj: Product):
        if not obj.cover_image:
            return None
        request = self.context.get("request")
        return (
            request.build_absolute_uri(obj.cover_image.url)
            if request
            else obj.cover_image.url
        )


class ProductListSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "product_name",
            "category",
            "brand",
            "cover_image",
            "uom",
            "slug",
            "updated_at",
            "price",
            "rating",
        ]

    def get_cover_image(self, obj: Product):
        if not obj.cover_image:
            return None
        request = self.context.get("request")

        return (
            request.build_absolute_uri(obj.cover_image.url)
            if request
            else obj.cover_image.url
        )
