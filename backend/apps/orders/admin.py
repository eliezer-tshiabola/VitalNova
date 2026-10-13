from django.contrib import admin
from django.utils import timezone

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = (
        "product", "product_name", "product_slug", "variant_name", "quantity",
        "base_unit_price", "discount_percent", "unit_price", "line_total",
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("number", "customer_name", "customer_phone", "status", "total", "created_at")
    list_filter = ("status", "province", "created_at")
    search_fields = ("number", "customer_name", "customer_phone", "customer_email")
    readonly_fields = ("number", "user", "subtotal", "delivery_fee", "total", "created_at", "updated_at")
    inlines = (OrderItemInline,)
    actions = ("mark_delivered",)

    @admin.action(description="Marquer comme livrées")
    def mark_delivered(self, request, queryset):
        queryset.exclude(status=Order.Status.CANCELLED).update(status=Order.Status.DELIVERED, delivered_at=timezone.now())
