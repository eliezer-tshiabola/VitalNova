import uuid
from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from apps.accounts.models import phone_validator


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "À confirmer"
        CONFIRMED = "confirmed", "Confirmée"
        SHIPPED = "shipped", "En livraison"
        DELIVERED = "delivered", "Livrée"
        CANCELLED = "cancelled", "Annulée"

    class Province(models.TextChoices):
        KINSHASA = "kinshasa", "Kinshasa"
        KATANGA = "katanga", "Katanga"
        OTHER = "other", "Autre"

    number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="orders", on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status, default=Status.PENDING)
    customer_name = models.CharField(max_length=160)
    customer_email = models.EmailField(blank=True)
    customer_phone = models.CharField(max_length=32, validators=[phone_validator])
    province = models.CharField(max_length=20, choices=Province)
    custom_province = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=120)
    address = models.TextField(max_length=600)
    instructions = models.TextField(max_length=600, blank=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.number} — {self.customer_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey("catalog.Product", related_name="order_items", on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=180)
    product_slug = models.SlugField()
    variant_name = models.CharField(max_length=100, blank=True)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    base_unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    discount_percent = models.PositiveSmallIntegerField(default=0)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    line_total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} × {self.product_name}"
