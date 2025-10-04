from rest_framework import generics, permissions
from apps.ecommerce.models.customer import Customer
from apps.ecommerce.serializers.customer import CustomerProfileSerializer

class CustomerProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.customer
