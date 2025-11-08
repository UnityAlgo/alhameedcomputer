from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.user_auth.models.base import Address
from apps.ecommerce.serializers.address import AddressSerializer


class AddressAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.GET.get("id"):
            try:
                address = Address.objects.get(
                    id=request.GET.get("id"), user=request.user
                )
            except Address.DoesNotExist:
                return Response({"detail": "Address not found."}, status=404)
            serializer = AddressSerializer(address)
            return Response(serializer.data)

        addresses = Address.objects.filter(user=request.user)
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)

    def put(self, request):
        address_id = request.data.get("id")

        if not address_id:
            return Response({"detail": "Address ID is required."}, status=400)

        try:
            address = Address.objects.get(id=address_id, user=request.user)
        except Address.DoesNotExist:
            return Response({"detail": "Address not found."}, status=404)

        serializer = AddressSerializer(address, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def patch(self, request):
        address_id = request.data.get("id")

        if not address_id:
            return Response({"detail": "Address ID is required."}, status=400)

        try:
            address = Address.objects.get(id=address_id, user=request.user)
        except Address.DoesNotExist:
            return Response({"detail": "Address not found."}, status=404)

        serializer = AddressSerializer(address, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request):
        address_id = request.GET.get("id")

        if not address_id:
            return Response({"detail": "Address ID is required."}, status=400)

        try:
            address = Address.objects.get(id=address_id, user=request.user)
        except Address.DoesNotExist:
            return Response({"detail": "Address not found."}, status=404)

        address.delete()
        return Response({"detail": "Address deleted successfully."}, status=204)
