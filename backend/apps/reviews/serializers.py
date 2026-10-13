from rest_framework import serializers

from apps.orders.models import Order, OrderItem

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="user.full_name", read_only=True)
    location = serializers.CharField(source="order_item.order.city", read_only=True)
    product_slug = serializers.CharField(source="product.slug", read_only=True)
    verified_purchase = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = (
            "id", "product_slug", "rating", "title", "comment", "author", "location",
            "verified_purchase", "created_at",
        )

    def get_verified_purchase(self, obj):
        return obj.order_item.order.status == Order.Status.DELIVERED


class ReviewCreateSerializer(serializers.ModelSerializer):
    order_item_id = serializers.PrimaryKeyRelatedField(source="order_item", queryset=OrderItem.objects.select_related("order", "product"))

    class Meta:
        model = Review
        fields = ("id", "order_item_id", "rating", "title", "comment")
        read_only_fields = ("id",)
        extra_kwargs = {"title": {"min_length": 3}, "comment": {"min_length": 10}}

    def validate_order_item_id(self, order_item):
        user = self.context["request"].user
        if order_item.order.user_id != user.id:
            raise serializers.ValidationError("Cette commande ne vous appartient pas.")
        if order_item.order.status != Order.Status.DELIVERED:
            raise serializers.ValidationError("Vous pourrez évaluer ce produit après confirmation de la livraison.")
        if hasattr(order_item, "review"):
            raise serializers.ValidationError("Ce produit a déjà été évalué pour cette commande.")
        if order_item.product_id is None:
            raise serializers.ValidationError("Ce produit n’est plus disponible pour une évaluation.")
        return order_item

    def create(self, validated_data):
        order_item = validated_data.pop("order_item")
        return Review.objects.create(
            user=self.context["request"].user,
            product=order_item.product,
            order_item=order_item,
            **validated_data,
        )

    def to_representation(self, instance):
        return ReviewSerializer(instance, context=self.context).data
