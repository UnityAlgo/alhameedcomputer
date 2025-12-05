import re
from django.db.models import Q, Count, Subquery, OuterRef, Q
from django.core.cache import cache
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.ecommerce.models.product import Product, ProductPrice, Brand, Category
from apps.ecommerce.serializers.product import ProductListSerializer
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
        queryset_filters = Q()

        if search_query:
            queryset_filters &= Q(product_name__icontains=search_query)

        if categories:
            queryset_filters &= Q(category__id__in=categories)

        if min_price:
            queryset_filters &= Q(price__gte=min_price)

        if max_price:
            queryset_filters &= Q(price__lte=max_price)

        print(queryset_filters)
        if not queryset_filters:
            return Response(
                data={
                    "products": [],
                    "message": "No search parameters provided.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        product_queryset = (
            Product.objects.filter(queryset_filters)
            .exclude(published=False)
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
            .order_by("-created_at")
        )

        categories = Category.objects.all().distinct()
        brands = Brand.objects.filter(
            id__in=product_queryset.values("brand")
        ).distinct()

        if request.get("brands"):
            product_queryset = product_queryset.filter(
                brand__id__in=request.get("brands").split(",")
            )

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
    def get(self, *args, **kwargs):
        search_query = self.request.GET.get("query", "").strip()

        if not search_query:
            suggestions = []
            if not cache.get("default_search_suggestions"):
                suggestions = list(
                    Product.objects.all()[:10].values_list("product_name", flat=True)
                )
            cache.set("default_search_suggestions", suggestions)
            return Response(
                {"suggestions": suggestions, "count": 0},
                status=status.HTTP_200_OK,
            )

        if len(search_query) > 100:
            return Response(
                {"error": "Search query too long"}, status=status.HTTP_400_BAD_REQUEST
            )

        cache_key = f"search_suggestions:{search_query.lower()}"
        cached_results = cache.get(cache_key)

        if cached_results is not None:
            return Response(cached_results)

        search_query = re.sub(r"[^\w\s-]", "", search_query)
        search_conditions = Q(product_name__icontains=search_query)
        suggestions = (
            Product.objects.filter(search_conditions)
            .annotate(
                relevance=Count("id", filter=Q(product_name__iexact=search_query))
            )
            .order_by("-relevance", "product_name")
            .values_list("product_name", flat=True)
            .distinct()[:10]
        )

        suggestions_list = list(suggestions)
        response_data = {
            "suggestions": suggestions_list,
            "count": len(suggestions_list),
            "query": search_query,
        }

        cache.set(cache_key, response_data, 300)
        return Response(response_data, status=status.HTTP_200_OK)
