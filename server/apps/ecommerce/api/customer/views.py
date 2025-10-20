from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.ecommerce.models.customer import Customer
from apps.ecommerce.serializers.customer import (
    CustomerProfileSerializer,
    ProfileSerializer,
)


class ProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, *args, **kwargs):
        if not hasattr(self.request.user, "customer"):
            return Response({"error": "Customer profile not found."}, status=404)

        serializer = ProfileSerializer(self.request.user.customer)
        return Response(data=serializer.data)


# class CustomerProfileAPIView(generics.RetrieveUpdateAPIView):
#     serializer_class = CustomerProfileSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_object(self):
#         return self.request.user.customer
