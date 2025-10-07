from apps.ecommerce.api.product.public import ProductAPIView

from django.urls import path
from apps.ecommerce.api.product.search import SearchProductAPIView, SuggestionsAPIView
from apps.ecommerce.api.category.views import CategoryAPIView, CategoryDetailAPIView
from apps.ecommerce.api.review.views import ProductReviewDetailAPIView, ProductReviewListCreateAPIView
from apps.ecommerce.api.cart.views import (
    CartRetrieveAPIView,
    CartAddItemAPIView,
    CartUpdateItemAPIView,
    CartRemoveItemAPIView,
    CartClearAPIView,
)
from apps.ecommerce.api.order.views import (
    OrderAPIView,
    OrderDetailAPIView,
    OrderCreateAPIView,
    OrderCancelAPIView,
)
from apps.ecommerce.api.wishlist.views import (
    WishlistRetrieveAPIView,
    WishlistAddItemAPIView,
    WishlistRemoveItemAPIView,
    WishlistClearAPIView,
)
from apps.ecommerce.api.brand.views import (  
    BrandListAPIView, BrandDetailAPIView
)

from apps.ecommerce.api.customer.views import (  
    CustomerProfileAPIView
)

from apps.ecommerce.api.address.views import (  
    AddressListCreateAPIView, AddressDetailAPIView
)

urlpatterns = [
    path("api/products", ProductAPIView.as_view()),
    path("api/products/search", SearchProductAPIView.as_view()),
    path("api/products/suggestions", SuggestionsAPIView.as_view()),
    # Categories
    path("api/categories", CategoryAPIView.as_view(), name="category-list"),
    path("api/categories/<uuid:pk>/", CategoryDetailAPIView.as_view(), name="category-detail"),

    # Cart
    path("api/cart/", CartRetrieveAPIView.as_view(), name="cart-retrieve"),
    path("api/cart/add/", CartAddItemAPIView.as_view(), name="cart-add-item"),
    path("api/cart/<uuid:item_id>/", CartUpdateItemAPIView.as_view(), name="cart-update-item"),
    path("api/cart/<uuid:item_id>/remove/", CartRemoveItemAPIView.as_view(), name="cart-remove-item"),
    path("api/cart/clear/", CartClearAPIView.as_view(), name="cart-clear"),

    # Orders
    path("api/orders", OrderAPIView.as_view(), name="order-list"),
    path("api/orders/create/", OrderCreateAPIView.as_view(), name="order-create"),
    # path("api/orders/<uuid:pk>/", OrderDetailAPIView.as_view(), name="order-detail"),
    path("api/orders/<uuid:pk>/cancel/", OrderCancelAPIView.as_view(), name="order-cancel"),

    # Reviews
    path("api/products/<uuid:product_id>/reviews", ProductReviewListCreateAPIView.as_view(), name="product-reviews"),
    path("api/reviews/<uuid:pk>", ProductReviewDetailAPIView.as_view(), name="review-detail"),

    # Wishlist
    path("api/wishlist/", WishlistRetrieveAPIView.as_view(), name="wishlist-retrieve"),
    path("api/wishlist/add/", WishlistAddItemAPIView.as_view(), name="wishlist-add-item"),
    path("api/wishlist/<uuid:product_id>/remove/", WishlistRemoveItemAPIView.as_view(), name="wishlist-remove-item"),
    path("api/wishlist/clear/", WishlistClearAPIView.as_view(), name="wishlist-clear"),

    # Brand URLs 
    path("api/brands", BrandListAPIView.as_view(), name="brand-list"),
    path("api/brands/<uuid:pk>", BrandDetailAPIView.as_view(), name="brand-detail"),
 
    # Customer Profile
    path("api/profile", CustomerProfileAPIView.as_view(), name="customer-profile"),

    # Address Management
    path("api/addresses", AddressListCreateAPIView.as_view(), name="address-list-create"),
    path("api/addresses/<uuid:pk>", AddressDetailAPIView.as_view(), name="address-detail"),

]


