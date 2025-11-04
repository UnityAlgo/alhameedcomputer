from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework.response import Response
from rest_framework import status


class CookieTokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view that reads refresh token from cookies
    and returns new access token (and optionally new refresh token if rotation is enabled)
    """
    
    def post(self, request, *args, **kwargs):
        # Try to get refresh token from cookies first
        refresh_token = request.COOKIES.get('refresh_token')
        
        # If not in cookies, try to get from request body
        if not refresh_token:
            refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response(
                {'detail': 'Refresh token not found'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Create a mutable copy of request data with the refresh token
        data = {'refresh': refresh_token}
        serializer = TokenRefreshSerializer(data=data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response(
                {'detail': 'Token is invalid or expired', 'code': 'token_not_valid'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Get the new tokens
        validated_data = serializer.validated_data
        response_data = {
            'access': validated_data['access'],
        }
        
        # If token rotation is enabled, a new refresh token will be included
        if 'refresh' in validated_data:
            response_data['refresh'] = validated_data['refresh']
        
        response = Response(response_data, status=status.HTTP_200_OK)
        
        # Set new access token in cookie
        response.set_cookie(
            key='access_token',
            value=validated_data['access'],
            httponly=True,
            secure=True,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=60 * 15,  # 15 minutes
            path='/'
        )
        
        # Set new refresh token in cookie if rotation is enabled
        if 'refresh' in validated_data:
            response.set_cookie(
                key='refresh_token',
                value=validated_data['refresh'],
                httponly=True,
                secure=True,  # Set to True in production with HTTPS
                samesite='Lax',
                max_age=60 * 60 * 24 * 30,  # 30 days
                path='/'
            )
        
        return response
