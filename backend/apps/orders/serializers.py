from rest_framework import serializers

from .models import Order, OrderItem
from .services import create_order


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=1)
    variant_id = serializers.IntegerField(min_value=1, required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, max_value=50)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = (
            "id", "product_name", "product_slug", "variant_name", "quantity",
            "base_unit_price", "discount_percent", "unit_price", "line_total",
        )


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            "number", "status", "customer_name", "customer_email", "customer_phone",
            "province", "custom_province", "city", "district", "address", "instructions",
            "subtotal", "delivery_fee", "total", "items", "created_at", "delivered_at",
        )
        read_only_fields = ("number", "status", "subtotal", "delivery_fee", "total", "created_at", "delivered_at")


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemInputSerializer(many=True, write_only=True)
    website = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Order
        fields = (
            "number", "customer_name", "customer_email", "customer_phone", "province",
            "custom_province", "city", "district", "address", "instructions", "items", "website",
        )
        read_only_fields = ("number",)
        extra_kwargs = {
            "customer_name": {"min_length": 3},
            "city": {"min_length": 2},
            "district": {"min_length": 2},
            "address": {"min_length": 8},
        }

    def validate(self, attrs):
        if attrs.pop("website", ""):
            raise serializers.ValidationError("Requête invalide.")
        if not attrs.get("items"):
            raise serializers.ValidationError({"items": "Ajoutez au moins un produit."})
        item_keys = [(item["product_id"], item.get("variant_id")) for item in attrs["items"]]
        if len(item_keys) != len(set(item_keys)):
            raise serializers.ValidationError({"items": "Regroupez les lignes identiques en une seule quantité."})
        if attrs.get("province") == Order.Province.OTHER and not attrs.get("custom_province", "").strip():
            raise serializers.ValidationError({"custom_province": "Indiquez votre province."})
        if attrs.get("province") != Order.Province.OTHER:
            attrs["custom_province"] = ""
        allowed_cities = {
            Order.Province.KINSHASA: {"Kinshasa"},
            Order.Province.KATANGA: {"Lubumbashi", "Kolwezi"},
        }
        if attrs.get("province") in allowed_cities and attrs.get("city") not in allowed_cities[attrs["province"]]:
            raise serializers.ValidationError({"city": "Cette ville ne correspond pas à la province sélectionnée."})
        return attrs

    def create(self, validated_data):
        items = validated_data.pop("items")
        return create_order(customer_data=validated_data, item_data=items, user=self.context["request"].user)

    def to_representation(self, instance):
        return OrderSerializer(instance, context=self.context).data
