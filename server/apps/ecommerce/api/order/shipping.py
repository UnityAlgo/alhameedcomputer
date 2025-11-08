from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from ...models.shipping_rule import ShippingRule


class ShippingRuleAPIView(APIView):
    def get(self, *args, **kwargs):
        weight = float(self.request.GET.get("weight", 0))
        amount = float(self.request.GET.get("amount", 0))
        city = self.request.GET.get("city", None)

        shipping_rules = ShippingRule.objects.filter(is_active=True)
        if city:
            shipping_rules = shipping_rules.filter(city=city)

        data = []
        for rule in shipping_rules:
            value = rule.calculate_shipping_cost(
                value=weight if rule.based_on == "weight" else amount
            )
            data.append(
                {
                    "id": rule.id,
                    "name": rule.name,
                    "based_on": rule.based_on,
                    "shipping_amount": value,
                }
            )
        return Response(data)
