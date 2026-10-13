from rest_framework import serializers

from .models import Category, DeliveryRule, Product, ProductImage, ProductVariant, QuantityDiscount


class CategorySerializer(serializers.ModelSerializer):
    background_image = serializers.ImageField(read_only=True)

    class Meta:
        model = Category
        fields = ("id", "slug", "title", "description", "background_image", "order")


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text", "order")


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ("id", "name", "sku", "stock_quantity")


class QuantityDiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuantityDiscount
        fields = ("quantity", "percent", "label")


class DeliveryRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryRule
        fields = ("min_quantity", "max_quantity", "fee", "label")


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    gallery = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    discounts = QuantityDiscountSerializer(many=True, read_only=True)
    delivery_rules = DeliveryRuleSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            "id", "slug", "name", "category", "price", "image", "short_description",
            "description", "specifications", "video_url", "stock_quantity", "is_popular",
            "is_demo", "gallery", "variants", "discounts", "delivery_rules", "updated_at",
        )
