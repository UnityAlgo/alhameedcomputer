from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from apps.ecommerce.models.wishlist import Wishlist
from apps.ecommerce.models.product import Product
from apps.ecommerce.serializers.wishlist import WishlistSerializer

# Retrieve Wishlist
class WishlistRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        customer = self.request.user.customer
        wishlist, created = Wishlist.objects.get_or_create(customer=customer)
        return wishlist

# Add to Wishlist
class WishlistAddItemAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        customer = request.user.customer
        wishlist, _ = Wishlist.objects.get_or_create(customer=customer)

        product_id = request.data.get("product_id")
        product = get_object_or_404(Product, id=product_id)

        wishlist.products.add(product)
        return Response(WishlistSerializer(wishlist).data, status=status.HTTP_200_OK)

# Remove from Wishlist
class WishlistRemoveItemAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id, *args, **kwargs):
        customer = request.user.customer
        wishlist = get_object_or_404(Wishlist, customer=customer)

        product = get_object_or_404(Product, id=product_id)
        wishlist.products.remove(product)

        return Response(WishlistSerializer(wishlist).data, status=status.HTTP_200_OK)

# Clear Wishlist
class WishlistClearAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        customer = request.user.customer
        wishlist = get_object_or_404(Wishlist, customer=customer)

        wishlist.products.clear()
        return Response({"detail": "Wishlist cleared"}, status=status.HTTP_200_OK)
