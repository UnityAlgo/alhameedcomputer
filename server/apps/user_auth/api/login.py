from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from apps.user_auth.serializers import LoginSerializer, UserSerializer


class LoginAPI(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = authenticate(
            email=serializer.validated_data.get("email"),
            password=serializer.validated_data.get("password"),
        )

        if user is None:
            return Response(
                data={"message": "Invalid user credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user_serializer = UserSerializer(user)
        refresh = RefreshToken.for_user(user)
        tokens = {"access": str(refresh.access_token), "refresh": str(refresh)}

        return Response(
            data={
                "tokens": tokens,
                "user": user_serializer.data,
            },
            status=status.HTTP_200_OK,
        )
