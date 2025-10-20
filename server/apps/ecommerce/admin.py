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
from .models.order import (
    Order,
    OrderItem,
    PaymentMethod,
    ShippingRule,
    DeliveryNote,
    DeliveryNoteItem,
    OrderStatus,
    DeliveryStatus,
)
from .models.cart import Cart, CartItem
from .models.review import ProductReview
from .models.base import UOM
from apps.user_auth.models.base import Address

from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from unfold.admin import ModelAdmin, TabularInline, StackedInline
from unfold.decorators import display


# ---------- CATEGORY ----------
@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ("name", "parent", "created_at", "updated_at")
    search_fields = ("name",)
    list_filter = ("parent",)
    ordering = ("name",)


admin.site.register(Currency)


@admin.register(PriceList)
class PriceListAdmin(ModelAdmin):
    list_display = ("price_list_name", "currency", "disabled", "buying", "selling")
    search_fields = ("price_list_name",)


# ---------- PRODUCT ----------
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductPriceInline(admin.TabularInline):
    model = ProductPrice
    extra = 1


@admin.register(Product)
class ProductAdmin(ModelAdmin):
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
class BrandAdmin(ModelAdmin):
    list_display = ("name", "created_at", "updated_at")
    search_fields = ("name",)
    ordering = ("name",)


admin.site.register(Customer)


# ---------- CART ----------
@admin.register(Cart)
class CartAdmin(ModelAdmin):
    list_display = ("customer", "grand_total", "total_qty", "updated_at")
    search_fields = ("customer__user__email", "customer__user__first_name")
    ordering = ("-updated_at",)


@admin.register(CartItem)
class CartItemAdmin(ModelAdmin):
    list_display = ("cart", "product", "quantity", "price", "amount")
    search_fields = ("product__product_name", "cart__customer__user__email")
    ordering = ("-id",)


# ---------- REVIEW ----------
@admin.register(ProductReview)
class ProductReviewAdmin(ModelAdmin):
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
class UOMAdmin(ModelAdmin):
    list_display = ("name", "created_at", "updated_at")
    search_fields = ("name",)
    ordering = ("name",)


# ---------- Address ----------


@admin.register(Address)
class AddressAdmin(ModelAdmin):
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
    search_fields = ["street", "city", "state", "postal_code"]  # ADD THIS LINE
    list_filter = ("country", "state", "city", "address_type", "default")
    ordering = ("-created_at",)
    list_per_page = 20


# Inline Classes
class OrderItemInline(TabularInline):
    model = OrderItem
    extra = 1
    fields = [
        "product",
        "quantity",
        "uom",
        "price",
        "amount",
        "price_list",
    ]
    readonly_fields = ["amount"]
    # Remove autocomplete_fields if related models don't have search_fields
    # Or keep only the ones that have search_fields defined
    # autocomplete_fields = ["product", "price_list"]

    def has_delete_permission(self, request, obj=None):
        # Prevent deletion if order is confirmed or shipped
        if obj and obj.status in [
            OrderStatus.CONFIRMED,
            OrderStatus.SHIPPED,
            OrderStatus.DELIVERED,
        ]:
            return False
        return super().has_delete_permission(request, obj)


class DeliveryNoteInline(StackedInline):
    model = DeliveryNote
    extra = 0
    fields = [
        "delivery_id",
        "status",
        "delivery_date",
        "tracking_number",
        "carrier",
    ]
    readonly_fields = ["delivery_id"]
    can_delete = False
    show_change_link = True


class DeliveryNoteItemInline(TabularInline):
    model = DeliveryNoteItem
    extra = 1
    fields = ["product", "quantity", "uom", "notes"]
    # Remove autocomplete if Product admin doesn't have search_fields
    # autocomplete_fields = ["product"]


# Main Admin Classes
@admin.register(PaymentMethod)
class PaymentMethodAdmin(ModelAdmin):
    list_display = ["name", "is_active_badge", "created_at"]
    list_filter = ["is_active", "created_at"]
    search_fields = ["name"]

    @display(description="Status", label=True)
    def is_active_badge(self, obj):
        if obj.is_active:
            return mark_safe('<span style="color: green;">●</span> Active')
        return mark_safe('<span style="color: red;">●</span> Inactive')


@admin.register(ShippingRule)
class ShippingRuleAdmin(ModelAdmin):
    list_display = [
        "name",
        "shipping_amount_display",
        "min_order_amount",
        "max_order_amount",
        "free_shipping_threshold",
        "is_active_badge",
    ]
    list_filter = [
        "is_active",
        "min_order_amount",
        "created_at",
    ]
    search_fields = ["name"]
    fieldsets = (
        (
            "Basic Information",
            {
                "fields": ("name", "is_active"),
            },
        ),
        (
            "Pricing",
            {
                "fields": (
                    "shipping_amount",
                    "free_shipping_threshold",
                ),
            },
        ),
        (
            "Order Amount Range",
            {
                "fields": ("min_order_amount", "max_order_amount"),
                "description": "Define the order amount range for this shipping rule",
            },
        ),
    )

    @display(description="Shipping Cost", ordering="shipping_amount")
    def shipping_amount_display(self, obj):
        return f"Rs{obj.shipping_amount}"

    @display(description="Status", label=True)
    def is_active_badge(self, obj):
        if obj.is_active:
            return mark_safe('<span style="color: green;">●</span> Active')
        return mark_safe('<span style="color: red;">●</span> Inactive')


@admin.register(Order)
class OrderAdmin(ModelAdmin):
    list_display = [
        "order_id",
        "customer_name",
        "status_badge",
        "total_qty",
        "grand_total_display",
        "order_date",
        "delivery_date",
        "payment_method",
    ]
    list_filter = [
        "order_date",
        "delivery_date",
        "status",
        "payment_method",
        "shipping_rule",
        "grand_total",
    ]
    search_fields = ["order_id", "customer__name", "customer__email", "notes"]
    readonly_fields = [
        "order_id",
        "total_qty",
        "total_amount",
        "shipping_charges",
        "grand_total",
        "order_date",
    ]
    # Remove autocomplete_fields that don't have search_fields in their admin
    # autocomplete_fields = ["customer", "payment_method", "shipping_rule", "delivery_address"]
    inlines = [OrderItemInline, DeliveryNoteInline]
    date_hierarchy = "order_date"

    fieldsets = (
        (
            "Order Information",
            {
                "fields": (
                    "order_id",
                    "customer",
                    "status",
                    "order_date",
                ),
            },
        ),
        (
            "Delivery Details",
            {
                "fields": (
                    "delivery_date",
                    "delivery_address",
                    "shipping_rule",
                ),
            },
        ),
        (
            "Payment",
            {
                "fields": ("payment_method",),
            },
        ),
        (
            "Order Totals",
            {
                "fields": (
                    "total_qty",
                    "total_amount",
                    "shipping_charges",
                    "total_taxes_and_charges",
                    "discount_amount",
                    "grand_total",
                ),
                "classes": ["collapse"],
            },
        ),
        (
            "Additional Information",
            {
                "fields": ("notes",),
                "classes": ["collapse"],
            },
        ),
    )

    actions = [
        "mark_as_confirmed",
        "mark_as_processing",
        "mark_as_shipped",
        "mark_as_canceled",
    ]

    @display(description="Customer")
    def customer_name(self, obj):
        return str(obj.customer)

    @display(description="Status", label=True)
    def status_badge(self, obj):
        colors = {
            "pending": "orange",
            "confirmed": "blue",
            "processing": "purple",
            "shipped": "cyan",
            "delivered": "green",
            "canceled": "red",
            "refunded": "gray",
        }
        color = colors.get(obj.status, "gray")
        return format_html(
            '<span style="color: {};">●</span> {}', color, obj.get_status_display()
        )

    @display(description="Grand Total", ordering="grand_total")
    def grand_total_display(self, obj):
        return f"Rs{obj.grand_total:,.2f}"

    @admin.action(description="Mark selected orders as Confirmed")
    def mark_as_confirmed(self, request, queryset):
        updated = queryset.filter(status=OrderStatus.PENDING).update(
            status=OrderStatus.CONFIRMED
        )
        self.message_user(request, f"{updated} orders marked as confirmed.")

    @admin.action(description="Mark selected orders as Processing")
    def mark_as_processing(self, request, queryset):
        updated = queryset.filter(status=OrderStatus.CONFIRMED).update(
            status=OrderStatus.PROCESSING
        )
        self.message_user(request, f"{updated} orders marked as processing.")

    @admin.action(description="Mark selected orders as Shipped")
    def mark_as_shipped(self, request, queryset):
        updated = queryset.filter(status=OrderStatus.PROCESSING).update(
            status=OrderStatus.SHIPPED
        )
        self.message_user(request, f"{updated} orders marked as shipped.")

    @admin.action(description="Cancel selected orders")
    def mark_as_canceled(self, request, queryset):
        updated = queryset.exclude(
            status__in=[OrderStatus.DELIVERED, OrderStatus.SHIPPED]
        ).update(status=OrderStatus.CANCELED)
        self.message_user(request, f"{updated} orders canceled.")

    def get_readonly_fields(self, request, obj=None):
        readonly = list(self.readonly_fields)
        if obj and obj.status in [OrderStatus.DELIVERED, OrderStatus.CANCELED]:
            # Make most fields readonly for delivered/canceled orders
            readonly.extend(
                ["customer", "payment_method", "shipping_rule", "delivery_address"]
            )
        return readonly

    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of confirmed or processed orders
        if obj and obj.status not in [OrderStatus.PENDING, OrderStatus.CANCELED]:
            return False
        return super().has_delete_permission(request, obj)


@admin.register(OrderItem)
class OrderItemAdmin(ModelAdmin):
    list_display = [
        "id",
        "order_id_display",
        "product",
        "quantity",
        "uom",
        "price_display",
        "amount_display",
    ]
    list_filter = [
        "order__order_date",
        "product",
        "uom",
    ]
    search_fields = ["order__order_id", "product__product_name"]
    readonly_fields = ["amount"]
    # Remove autocomplete_fields that don't have search_fields
    # autocomplete_fields = ["product", "order", "price_list"]

    @display(description="Order")
    def order_id_display(self, obj):
        return obj.order.order_id if obj.order else "-"

    @display(description="Price", ordering="price")
    def price_display(self, obj):
        return f"Rs{obj.price:,.2f}"

    @display(description="Amount", ordering="amount")
    def amount_display(self, obj):
        return f"Rs{obj.amount:,.2f}"


@admin.register(DeliveryNote)
class DeliveryNoteAdmin(ModelAdmin):
    list_display = [
        "delivery_id",
        "order_id_display",
        "customer_name",
        "status_badge",
        "delivery_date",
        "actual_delivery_date",
        "tracking_number",
        "carrier",
    ]
    list_filter = [
        "status",
        "delivery_date",
        "actual_delivery_date",
        "carrier",
    ]
    search_fields = [
        "delivery_id",
        "order__order_id",
        "customer__name",
        "tracking_number",
        "notes",
    ]
    readonly_fields = ["delivery_id", "actual_delivery_date"]
    # Remove autocomplete_fields that don't have search_fields
    # autocomplete_fields = ["order", "customer", "delivery_address"]
    inlines = [DeliveryNoteItemInline]
    date_hierarchy = "delivery_date"

    fieldsets = (
        (
            "Delivery Information",
            {
                "fields": (
                    "delivery_id",
                    "order",
                    "customer",
                    "status",
                ),
            },
        ),
        (
            "Delivery Details",
            {
                "fields": (
                    "delivery_date",
                    "actual_delivery_date",
                    "delivery_address",
                ),
            },
        ),
        (
            "Shipping Information",
            {
                "fields": (
                    "tracking_number",
                    "carrier",
                ),
            },
        ),
        (
            "Delivery Confirmation",
            {
                "fields": (
                    "delivered_by",
                    "received_by",
                    "signature",
                ),
                "classes": ["collapse"],
            },
        ),
        (
            "Notes",
            {
                "fields": ("notes",),
                "classes": ["collapse"],
            },
        ),
    )

    actions = ["mark_as_in_transit", "mark_as_delivered_action", "cancel_delivery"]

    @display(description="Order")
    def order_id_display(self, obj):
        return obj.order.order_id if obj.order else "-"

    @display(description="Customer")
    def customer_name(self, obj):
        return obj.customer.name if obj.customer else "-"

    @display(description="Status", label=True)
    def status_badge(self, obj):
        colors = {
            "draft": "gray",
            "to_deliver": "orange",
            "in_transit": "blue",
            "delivered": "green",
            "canceled": "red",
        }
        color = colors.get(obj.status, "gray")
        return format_html(
            '<span style="color: {};">●</span> {}', color, obj.get_status_display()
        )

    @admin.action(description="Mark as In Transit")
    def mark_as_in_transit(self, request, queryset):
        updated = queryset.filter(status=DeliveryStatus.TO_DELIVER).update(
            status=DeliveryStatus.IN_TRANSIT
        )
        self.message_user(request, f"{updated} deliveries marked as in transit.")

    @admin.action(description="Mark as Delivered")
    def mark_as_delivered_action(self, request, queryset):
        count = 0
        for delivery in queryset.filter(
            status__in=[DeliveryStatus.TO_DELIVER, DeliveryStatus.IN_TRANSIT]
        ):
            delivery.mark_as_delivered()
            count += 1
        self.message_user(request, f"{count} deliveries marked as delivered.")

    @admin.action(description="Cancel Delivery")
    def cancel_delivery(self, request, queryset):
        updated = queryset.exclude(status=DeliveryStatus.DELIVERED).update(
            status=DeliveryStatus.CANCELED
        )
        self.message_user(request, f"{updated} deliveries canceled.")

    def get_readonly_fields(self, request, obj=None):
        readonly = list(self.readonly_fields)
        if obj and obj.status == DeliveryStatus.DELIVERED:
            readonly.extend(
                [
                    "order",
                    "customer",
                    "delivery_date",
                    "delivery_address",
                    "tracking_number",
                    "carrier",
                ]
            )
        return readonly

    def has_delete_permission(self, request, obj=None):
        if obj and obj.status == DeliveryStatus.DELIVERED:
            return False
        return super().has_delete_permission(request, obj)


@admin.register(DeliveryNoteItem)
class DeliveryNoteItemAdmin(ModelAdmin):
    list_display = [
        "id",
        "delivery_id_display",
        "product",
        "quantity",
        "uom",
    ]
    list_filter = ["product", "uom", "delivery_note__delivery_date"]
    search_fields = [
        "delivery_note__delivery_id",
        "product__product_name",
        "notes",
    ]
    # Remove autocomplete_fields that don't have search_fields
    # autocomplete_fields = ["delivery_note", "product"]

    @display(description="Delivery Note")
    def delivery_id_display(self, obj):
        return obj.delivery_note.delivery_id if obj.delivery_note else "-"
