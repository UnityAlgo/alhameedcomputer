from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ecommerce.models.product import Product, price_subquery
from apps.ecommerce.serializers.product import ProductSerializer, ProductListSerializer


class ProductAPIView(APIView):
    def get(self, *args, **kwargs):
        request = self.request

        if request.GET.get("id"):
            try:
                product_queryset = Product.objects.annotate(price=price_subquery).get(
                    id=request.GET.get("id")
                )
                serializer = ProductSerializer(
                    product_queryset, context={"request": self.request}
                )
                return Response(serializer.data)
            except Product.DoesNotExist:
                return Response({"detail": "Product not found."}, status=404)

        product_queryset = Product.objects.filter(published=True).annotate(
            price=price_subquery
        ).order_by("-featured")[:30]

        serializer = ProductListSerializer(
            product_queryset, many=True, context={"request": self.request}
        )
        return Response(serializer.data)
