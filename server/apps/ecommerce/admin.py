from django.contrib import admin
from .models.product import (
    Product,
    ProductImage,
    Brand,
    ProductPrice,
    PriceList,
    Currency,
)
from .models.category import Category
from .models.customer import Customer
from .models.order import Order, OrderItem
from .models.cart import Cart, CartItem
from .models.review import ProductReview
from .models.base import UOM
from apps.user_auth.models.base import Address


# ---------- CATEGORY ----------
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "parent", "created_at", "updated_at")
    search_fields = ("name",)
    list_filter = ("parent",)
    ordering = ("name",)


admin.site.register(Currency)


@admin.register(PriceList)
class PriceListAdmin(admin.ModelAdmin):
    list_display = ("price_list_name", "currency", "disabled", "buying", "selling")


# ---------- PRODUCT ----------
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductPriceInline(admin.TabularInline):
    model = ProductPrice
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "product_name",
        "brand",
        "category",
        "rating",
        "created_at",
    )
    search_fields = (
        "product_name",
        "short_description",
        "description",
        "brand__name",
        "category__name",
    )
    list_filter = ("category", "uom", "brand")
    ordering = ("-created_at",)
    inlines = [ProductImageInline, ProductPriceInline]


# ---------- BRAND ----------
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at", "updated_at")
    search_fields = ("name",)
    ordering = ("name",)


admin.site.register(Customer)



@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    class OrderItemInline(admin.TabularInline):
        model = OrderItem
        extra = 1

    list_display = ("id", "customer", "status", "total_amount", "order_date")
    list_filter = ("status", "order_date")
    search_fields = ("id", "customer__user__email", "customer__user__first_name")
    ordering = ("-order_date",)
    inlines = [OrderItemInline]


# ---------- CART ----------
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("customer", "grand_total", "total_qty", "updated_at")
    search_fields = ("customer__user__email", "customer__user__first_name")
    ordering = ("-updated_at",)


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("cart", "product", "quantity", "price", "amount")
    search_fields = ("product__product_name", "cart__customer__user__email")
    ordering = ("-id",)


# ---------- REVIEW ----------
@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "customer", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = (
        "product__product_name",
        "customer__user__email",
        "comment",
    )
    ordering = ("-created_at",)


# ---------- UOM ----------
@admin.register(UOM)
class UOMAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at", "updated_at")
    search_fields = ("name",)
    ordering = ("name",)


# ---------- Address ----------


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "title",
        "address_type",
        "city",
        "state",
        "country",
        "postal_code",
        "default",
        "created_at",
    )
    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
        "user__username",
        "title",
        "city",
        "state",
        "country",
        "postal_code",
    )
    list_filter = ("country", "state", "city", "address_type", "default")
    ordering = ("-created_at",)
    list_per_page = 20
