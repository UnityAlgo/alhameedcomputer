from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from apps.ecommerce.models.review import ProductReview
from apps.ecommerce.serializers.review import ProductReviewSerializer

# List + Create Reviews for a Product
class ProductReviewListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs["product_id"]
        return ProductReview.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        product_id = self.kwargs["product_id"]
        serializer.save(product_id=product_id, customer=self.request.user.customer)

# Update/Delete a Review (only owner can do it)
class ProductReviewDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ProductReview.objects.all()
    lookup_field = "pk"

    def perform_update(self, serializer):
        if self.get_object().customer != self.request.user.customer:
            raise PermissionDenied("You can only update your own review.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.customer != self.request.user.customer:
            raise PermissionDenied("You can only delete your own review.")
        instance.delete()
