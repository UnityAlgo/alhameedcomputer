from apps.ecommerce.api import OrderAPIView, OrderCheckoutAPIView
from apps.ecommerce.api.product.public import ProductAPIView

from django.urls import path
from apps.ecommerce.api.product.search import SearchProductAPIView, SuggestionsAPIView
from apps.ecommerce.api.category.views import CategoryAPIView, CategoryDetailAPIView
from apps.ecommerce.api.review.views import (
    ProductReviewDetailAPIView,
    ProductReviewListCreateAPIView,
)
from apps.ecommerce.api.cart.main import CartAPIView

# from apps.ecommerce.api.order.views import (
#     OrderAPIView,
#     OrderDetailAPIView,
#     OrderCreateAPIView,
#     OrderCancelAPIView,
# )
from apps.ecommerce.api.wishlist.views import (
    WishlistRetrieveAPIView,
    WishlistAddItemAPIView,
    WishlistRemoveItemAPIView,
    WishlistClearAPIView,
)
from apps.ecommerce.api.brand.views import BrandListAPIView, BrandDetailAPIView

from apps.ecommerce.api.customer.views import ProfileAPIView

from apps.ecommerce.api.address.views import (
    AddressAPIView,
    # AddressListCreateAPIView,
    # AddressDetailAPIView,
)

urlpatterns = [
    path("api/products", ProductAPIView.as_view()),
    path("api/products/search", SearchProductAPIView.as_view()),
    path("api/products/suggestions", SuggestionsAPIView.as_view()),
    path("api/categories", CategoryAPIView.as_view()),
    path("api/categories/<uuid:pk>/", CategoryDetailAPIView.as_view()),
    path("api/customer/cart", CartAPIView.as_view()),
    path("api/orders/checkout", OrderCheckoutAPIView.as_view()),
    path("api/orders", OrderAPIView.as_view()),
    #
    # path("api/orders/create/", OrderCreateAPIView.as_view()),
    # # path("api/orders/<uuid:pk>/", OrderDetailAPIView.as_view()),
    # path(
    #     "api/orders/<uuid:pk>/cancel/",
    #     OrderCancelAPIView.as_view(),
    #     name="order-cancel",
    # ),
    # Reviews
    path(
        "api/products/<uuid:product_id>/reviews",
        ProductReviewListCreateAPIView.as_view(),
        name="product-reviews",
    ),
    path(
        "api/reviews/<uuid:pk>",
        ProductReviewDetailAPIView.as_view(),
        name="review-detail",
    ),
    # Wishlist
    path("api/wishlist/", WishlistRetrieveAPIView.as_view(), name="wishlist-retrieve"),
    path(
        "api/wishlist/add/", WishlistAddItemAPIView.as_view(), name="wishlist-add-item"
    ),
    path(
        "api/wishlist/<uuid:product_id>/remove/",
        WishlistRemoveItemAPIView.as_view(),
        name="wishlist-remove-item",
    ),
    path("api/wishlist/clear/", WishlistClearAPIView.as_view(), name="wishlist-clear"),
    # Brand URLs
    path("api/brands", BrandListAPIView.as_view(), name="brand-list"),
    path("api/brands/<uuid:pk>", BrandDetailAPIView.as_view(), name="brand-detail"),
    # Customer Profile
    path("api/profile", ProfileAPIView.as_view(), name="customer-profile"),
    # Address Management
    path("api/user/address", AddressAPIView.as_view()),
    # path(
    #     "api/user/address/<uuid:pk>", AddressDetailAPIView.as_view(), name="address-detail"
    # ),
]
