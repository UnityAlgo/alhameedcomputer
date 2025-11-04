from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from django.db import transaction

from apps.ecommerce.models.cart import Cart, CartItem
from apps.ecommerce.models.product import Product
from apps.ecommerce.models.customer import Customer
from apps.ecommerce.serializers.cart import (
    CartSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
)


class CartAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, *args, **kwargs):
        customer = get_object_or_404(Customer, user=self.request.user)
        cart, _ = Cart.objects.get_or_create(customer=customer)
        serializer = CartSerializer(cart, context={"request": self.request})

        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    def put(self, *args, item_id, **kwargs):
        serializer = UpdateCartItemSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        customer = get_object_or_404(Customer, user=self.request.user)
        cart = get_object_or_404(Cart, customer=customer)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)

        cart_item.quantity = serializer.validated_data["quantity"]
        cart_item.save()

        cart.save()

        cart_serializer = CartSerializer(cart, context={"request": self.request})
        return Response(
            {"message": "Cart item updated successfully", "cart": cart_serializer.data},
            status=status.HTTP_200_OK,
        )

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        customer = get_object_or_404(Customer, user=request.user)
        cart, _ = Cart.objects.get_or_create(customer=customer)

        product = get_object_or_404(Product, id=serializer.validated_data["product_id"])
        quantity = serializer.validated_data["quantity"]

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": quantity, "price": product.get_price()},
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

            message = "Cart updated successfully"
        else:
            message = "Item added to cart"

        cart.save()

        cart_serializer = CartSerializer(cart, context={"request": request})
        return Response(
            {"message": message, "cart": cart_serializer.data},
            status=status.HTTP_200_OK,
        )

    @transaction.atomic
    def delete(self, request, item_id, *args, **kwargs):
        customer = get_object_or_404(Customer, user=request.user)
        cart = get_object_or_404(Cart, customer=customer)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)

        cart_item.delete()
        cart.save()

        # cart.items.all().delete()
        # cart.save()

        cart_serializer = CartSerializer(cart, context={"request": request})
        return Response(
            {"message": "Item removed from cart", "cart": cart_serializer.data},
            status=status.HTTP_200_OK,
        )
