from rest_framework.views import APIView
from rest_framework.response import Response

from apps.ecommerce.models.website import Banner


class LandingPageAPIView(APIView):
    def get(self, *args, **kwargs):
        banners = list(
            Banner.objects.filter(is_active=True)
            .all()
            .order_by("idx")
            .values("idx", "image", "link", "html_content")
        )

        return Response({"banners": banners})
