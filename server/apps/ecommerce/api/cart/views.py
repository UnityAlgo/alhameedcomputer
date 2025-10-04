from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotAuthenticated
from django.shortcuts import get_object_or_404

from apps.ecommerce.models.cart import Cart, CartItem
from apps.ecommerce.models.product import Product
from apps.ecommerce.models.customer import Customer 
from apps.ecommerce.serializers.cart import (
    CartSerializer,
    CartItemAddSerializer,
    CartItemUpdateSerializer,
)


# Get current user’s cart
class CartRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if not user.is_authenticated:
            raise NotAuthenticated("You must be logged in to view your cart.")

        customer, _ = Customer.objects.get_or_create(user=user)
        return Cart.objects.get_or_create(customer=customer)[0]


# Add item to cart
class CartAddItemAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CartItemAddSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"success": False, "message": "Validation failed", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        if not user.is_authenticated:
            raise NotAuthenticated("You must be logged in to add to cart.")

        customer, _ = Customer.objects.get_or_create(user=user)
        cart, _ = Cart.objects.get_or_create(customer=customer)

        product = get_object_or_404(Product, id=serializer.validated_data["product_id"])

        unit_price = getattr(product, "final_price", None) or getattr(product, "price", None)
        if unit_price is None:
            return Response(
                {"success": False, "message": "Product price is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart.add_item(
            product=product,
            quantity=serializer.validated_data["quantity"],
            price=unit_price,
        )

        cart.calculate_totals()
        cart.save()

        return Response(
            {"success": True, "message": "Item added to cart successfully", "data": CartSerializer(cart).data},
            status=status.HTTP_200_OK,
        )


# Update cart item
class CartUpdateItemAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id, *args, **kwargs):
        serializer = CartItemUpdateSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(
                {"success": False, "message": "Validation failed", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        customer, _ = Customer.objects.get_or_create(user=request.user)
        cart = get_object_or_404(Cart, customer=customer)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)

        action = serializer.validated_data.get("action", "update")

        if action == "remove":
            item.delete()
            message = "Item removed from cart"
        else:
            quantity = serializer.validated_data.get("quantity")
            if quantity is None:
                return Response(
                    {"success": False, "message": "Quantity is required for update"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            item.quantity = quantity
            item.save()
            message = "Item updated successfully"

        cart.calculate_totals()
        cart.save()

        return Response(
            {"success": True, "message": message, "data": CartSerializer(cart).data},
            status=status.HTTP_200_OK,
        )

# Remove item from cart
class CartRemoveItemAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id, *args, **kwargs):
        customer, _ = Customer.objects.get_or_create(user=request.user)  
        cart = get_object_or_404(Cart, customer=customer)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        item.delete()

        cart.calculate_totals()
        cart.save()

        return Response({
            "success": True,
            "message": "Item removed from cart successfully",
            "data": CartSerializer(cart).data
        }, status=status.HTTP_200_OK)


# Clear cart
class CartClearAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        customer, _ = Customer.objects.get_or_create(user=request.user) 
        cart = get_object_or_404(Cart, customer=customer)

        cart.items.all().delete()
        cart.calculate_totals()
        cart.save()

        return Response({
            "success": True,
            "message": "Cart cleared successfully",
            "data": CartSerializer(cart).data
        }, status=status.HTTP_200_OK)
