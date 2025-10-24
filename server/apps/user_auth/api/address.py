from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models.base import Address


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"


class AddressAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, *args, **kwargs):
        address_queryset = Address.objects.filter(user=self.request.user)
        serializer = AddressSerializer(
            address_queryset, many=True, context={"request": self.request}
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
        )
