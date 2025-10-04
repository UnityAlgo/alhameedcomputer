from django.db.models import Q
from rest_framework.views import APIView

# from rest_framework.response import Response
from apps.ecommerce.models.product import Product, Brand, price_subquery
from apps.ecommerce.serializers.product import ProductListSerializer, Category
from .utls import ProductPagination


class SearchProductAPIView(APIView):
    def get(self, *args, **kwargs):
        request = self.request.GET
        search_query = str(request.get("query", "")).strip()
        min_price = request.get("min_price", 0)
        max_price = request.get("max_price", 0)
        category = request.get("category")
        queryset_filters = Q()

        if search_query:
            queryset_filters &= Q(product_name__icontains=search_query)

        if category:
            queryset_filters &= Q(category__id=category)

        product_queryset = (
            Product.objects.filter(queryset_filters)
            .annotate(price=price_subquery)
            .order_by("-created_at")
        )

        brands = Brand.objects.filter(product__in=product_queryset).distinct()
        categories = Category.objects.all().distinct()

        paginator = ProductPagination()
        paginated_products = paginator.paginate_queryset(product_queryset, self.request)
        serializer = ProductListSerializer(
            paginated_products, many=True, context={"request": self.request}
        )

        return paginator.get_paginated_response(
            {
                "products": serializer.data,
                "total_count": product_queryset.count(),
                "search_query": search_query,
                "attributes": {
                    "brand": [{"id": brand.id, "name": brand.name} for brand in brands],
                    "category": [{"id": category.id, "name": category.name} for category in categories],
                },
                "filters": {
                    "min_price": min_price,
                    "max_price": max_price,
                    "category": category,
                },
            }
        )
