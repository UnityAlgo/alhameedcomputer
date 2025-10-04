from rest_framework import generics
from apps.ecommerce.models.product import Brand
from apps.ecommerce.serializers.product import BrandSerializer

class BrandListAPIView(generics.ListAPIView):
    queryset = Brand.objects.all().order_by("name")
    serializer_class = BrandSerializer


class BrandDetailAPIView(generics.RetrieveAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    lookup_field = "pk"
