from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.user_auth.serializers.user import UserSerializer, UpdateUserSerializer
from apps.user_auth.models import User


class RegisterUserAPIView(APIView):
    def post(self, *args, **kwargs):
        request_data: dict = self.request.data
        serializer = UserSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        from apps.ecommerce.models.customer import Customer

        Customer.objects.create(user=user)

        return Response(status=status.HTTP_201_CREATED)


class UserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user: User = request.user

        serializer = UserSerializer(user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, *args, **kwargs):
        request_data = self.request.data
        if (
            User.objects.filter(mobile=request_data.get("mobile"))
            .exclude(id=self.request.user.id)
            .exists()
        ):
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Mobile number already in use"},
            )
        user = self.request.user

        serializer = UpdateUserSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.update(user, serializer.validated_data)

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "user updated successfully", "user": serializer.data},
        )
