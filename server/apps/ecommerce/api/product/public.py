from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Q, Subquery, OuterRef

from apps.ecommerce.models.product import Product, ProductPrice
from apps.ecommerce.serializers.product import ProductSerializer, ProductListSerializer


class ProductAPIView(APIView):
    def get(self, *args, **kwargs):
        request = self.request

        if request.GET.get("slug"):
            try:
                product_queryset = Product.objects.annotate(
                    price=Subquery(
                        ProductPrice.objects.filter(
                            product=OuterRef("pk"),
                        )
                        .filter(
                            Q(valid_from__lte=timezone.now())
                            | (
                                Q(valid_from__isnull=True)
                                & Q(valid_to__gte=timezone.now())
                            )
                            | Q(valid_to__isnull=True)
                        )
                        .order_by("-valid_from")
                        .values("price")[:1]
                    )
                ).get(slug=request.GET.get("slug"))
                serializer = ProductSerializer(
                    product_queryset, context={"request": self.request}
                )
                return Response(serializer.data)
            except Product.DoesNotExist:
                return Response({"detail": "Product not found."}, status=404)

        product_queryset = (
            Product.objects.filter(published=True)
            .annotate(
                price=Subquery(
                    ProductPrice.objects.filter(
                        product=OuterRef("pk"),
                    )
                    .filter(
                        Q(valid_from__lte=timezone.now())
                        | (Q(valid_from__isnull=True) & Q(valid_to__gte=timezone.now()))
                        | Q(valid_to__isnull=True)
                    )
                    .order_by("-valid_from")
                    .values("price")[:1]
                )
            )
            .order_by("-featured")[:30]
        )

        serializer = ProductListSerializer(
            product_queryset, many=True, context={"request": self.request}
        )
        types = request.GET.get("type")
        data = {}

        if types:
            if "deals" in types:
                deals_queryset = Product.objects.filter(category__name="Deals")[:20]
                deals_serializer = ProductListSerializer(
                    deals_queryset, many=True, context={"request": self.request}
                )
                data["deals"] = deals_serializer.data

            if "products" in types:
                data["products"] = serializer.data

        return Response(data=data if data else serializer.data)
