from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from apps.user_auth.serializers import (
    LoginSerializer,
    UserSerializer,
    AuthTokenSerializer,
)


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
        token_serializer = AuthTokenSerializer()
        refresh = token_serializer.get_token(user)

        tokens = {"access": str(refresh.access_token), "refresh": str(refresh)}
        
        response = Response(
            data={
                "tokens": tokens,
                "user": user_serializer.data,
            },
            status=status.HTTP_200_OK,
        )
        
        # Set tokens in httpOnly cookies
        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,
            secure=True,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=60 * 15,  # 15 minutes
            path='/'
        )
        
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=60 * 60 * 24 * 30,  # 30 days
            path='/'
        )
        
        return response

