from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class LogoutAPI(APIView):
    """
    Logout endpoint that clears authentication cookies
    """
    
    def post(self, request):
        response = Response(
            {'message': 'Successfully logged out'},
            status=status.HTTP_200_OK
        )
        
        # Delete authentication cookies
        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/')
        
        return response
