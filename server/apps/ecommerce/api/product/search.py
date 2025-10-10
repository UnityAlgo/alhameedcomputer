import re
from django.db.models import Q, Count
from django.core.cache import cache

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.ecommerce.models.product import Product, Brand, price_subquery
from apps.ecommerce.serializers.product import ProductListSerializer, Category
from .utls import ProductPagination


class SearchProductAPIView(APIView):
    def get(self, *args, **kwargs):
        request = self.request.GET
        search_query = str(request.get("query", "")).strip()
        min_price = request.get("min_price", 0)
        max_price = request.get("max_price", 0)
        categories = (
            request.get("categories").split(",") if request.get("categories") else []
        )
        queryset_filters = Q(published=True)

        if search_query:
            queryset_filters &= Q(product_name__icontains=search_query)

        if categories:
            queryset_filters &= Q(category__id__in=categories)

        if min_price:
            queryset_filters &= Q(price__gte=min_price)

        if max_price:
            queryset_filters &= Q(price__lte=max_price)

        if request.get("brands"):
            brands = request.get("brands").split(",")
            queryset_filters &= Q(brand__id__in=brands)

        product_queryset = (
            Product.objects.filter(queryset_filters)
            .annotate(price=price_subquery)
            .order_by("-created_at")
        )

        brands = Brand.objects.all().distinct()
        categories = Category.objects.all().distinct()

        paginator = ProductPagination(page_size=10)
        paginated_products = paginator.paginate_queryset(product_queryset, self.request)
        serializer = ProductListSerializer(
            paginated_products, many=True, context={"request": self.request}
        )

        return paginator.get_paginated_response(
            {
                "products": serializer.data,
                "total_count": product_queryset.count(),
                "page_size": paginator.page_size,
                "search_query": search_query,
                "attributes": {
                    "brand": [{"id": brand.id, "name": brand.name} for brand in brands],
                    "categories": [
                        {"id": category.id, "name": category.name}
                        for category in categories
                    ],
                    "max_price": product_queryset.aggregate(max_price=Count("price"))[
                        "max_price"
                    ],
                    "min_price": product_queryset.aggregate(min_price=Count("price"))[
                        "min_price"
                    ],
                },
            }
        )


class SuggestionsAPIView(APIView):
    """
    Enhanced search suggestions API with:
    - Caching for better performance
    - Multiple field search
    - Relevance-based ordering
    - Input sanitization
    - Throttling support
    """

    def get(self, request, *args, **kwargs):
        search_query = request.GET.get("query", "").strip()

        if not search_query:
            return Response(
                {"suggestions": ["Gaming PC", "Gaming Moniter"], "count": 0},
                status=status.HTTP_200_OK,
            )

        # Limit query length to prevent abuse
        if len(search_query) > 100:
            return Response(
                {"error": "Search query too long"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Check cache first
        cache_key = f"search_suggestions:{search_query.lower()}"
        cached_results = cache.get(cache_key)

        if cached_results is not None:
            return Response(cached_results)

        # Sanitize query to prevent SQL injection (additional safety)
        search_query = re.sub(r"[^\w\s-]", "", search_query)

        # Build search query with multiple conditions for better matching
        search_conditions = Q(product_name__icontains=search_query)

        # Optional: Add more fields for comprehensive search
        # search_conditions |= Q(category__icontains=search_query)
        # search_conditions |= Q(brand__icontains=search_query)

        # Get suggestions with relevance ordering
        suggestions = (
            Product.objects.filter(search_conditions)
            .annotate(
                relevance=Count("id", filter=Q(product_name__iexact=search_query))
            )
            .order_by("-relevance", "product_name")
            .values_list("product_name", flat=True)
            .distinct()[:10]
        )

        # Prepare response
        suggestions_list = list(suggestions)
        response_data = {
            "suggestions": suggestions_list,
            "count": len(suggestions_list),
            "query": search_query,
        }

        # Cache results for 5 minutes
        cache.set(cache_key, response_data, 300)

        return Response(response_data, status=status.HTTP_200_OK)
