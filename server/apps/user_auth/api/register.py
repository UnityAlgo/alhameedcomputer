from rest_framework.views import APIView
from rest_framework.response import Response
from apps.user_auth.serializers.register import RegisterUserSerializer
from apps.ecommerce.models.customer import Customer 


class RegisterAPI(APIView):
    def post(self, *args, **kwargs):
        serializer = RegisterUserSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        Customer.objects.get_or_create(user=user)

        return Response({"message": "User registered successfully"}, status=201)
