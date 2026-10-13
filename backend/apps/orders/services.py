from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction
from rest_framework import serializers

from apps.catalog.models import Product, ProductVariant

from .models import Order, OrderItem

MONEY = Decimal("0.01")


def money(value):
    return Decimal(value).quantize(MONEY, rounding=ROUND_HALF_UP)


@transaction.atomic
def create_order(*, customer_data, item_data, user=None):
    product_ids = [item["product_id"] for item in item_data]
    products = {
        product.id: product
        for product in Product.objects.select_for_update().filter(id__in=product_ids, is_active=True).prefetch_related(
            "discounts", "delivery_rules", "variants"
        )
    }
    if len(products) != len(set(product_ids)):
        raise serializers.ValidationError({"items": "Un ou plusieurs produits sont indisponibles."})

    order = Order.objects.create(user=user if getattr(user, "is_authenticated", False) else None, **customer_data)
    subtotal = Decimal("0.00")
    delivery_fee = Decimal("0.00")

    for item in item_data:
        product = products[item["product_id"]]
        quantity = item["quantity"]
        if product.stock_quantity < quantity:
            raise serializers.ValidationError({"items": f"Stock insuffisant pour {product.name}."})

        variant_name = ""
        variant_id = item.get("variant_id")
        if variant_id:
            variant = next((variant for variant in product.variants.all() if variant.id == variant_id and variant.is_active), None)
            if not variant or variant.stock_quantity < quantity:
                raise serializers.ValidationError({"items": f"Variante indisponible pour {product.name}."})
            variant_name = variant.name

        discount = next((tier for tier in reversed(list(product.discounts.all())) if quantity >= tier.quantity), None)
        percent = discount.percent if discount else 0
        unit_price = money(product.price * (Decimal("1") - Decimal(percent) / Decimal("100")))
        line_total = money(unit_price * quantity)
        rule = next((rule for rule in product.delivery_rules.all() if quantity >= rule.min_quantity and (rule.max_quantity is None or quantity <= rule.max_quantity)), None)
        if rule is None:
            raise serializers.ValidationError({"items": f"Les frais de livraison de {product.name} ne sont pas configurés."})

        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            product_slug=product.slug,
            variant_name=variant_name,
            quantity=quantity,
            base_unit_price=product.price,
            discount_percent=percent,
            unit_price=unit_price,
            line_total=line_total,
        )
        subtotal += line_total
        delivery_fee += rule.fee

    order.subtotal = money(subtotal)
    order.delivery_fee = money(delivery_fee)
    order.total = money(subtotal + delivery_fee)
    order.save(update_fields=("subtotal", "delivery_fee", "total", "updated_at"))
    return order
