from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.user_auth.serializers.user import UserSerializer


class RegisterUserAPIView(APIView):
    def post(self, *args, **kwargs):
        serializer = UserSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()


        from django.conf import settings

        if "apps.ecommerce" in settings.INSTALLED_APPS:
            from apps.ecommerce.models.customer import Customer
            Customer.objects.create(user=user)

        return Response(status=status.HTTP_201_CREATED)
