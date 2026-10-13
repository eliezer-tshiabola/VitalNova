from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.catalog.models import Category, DeliveryRule, Product, QuantityDiscount

from .models import Order


class OrderApiTests(APITestCase):
    def setUp(self):
        category = Category.objects.create(title="Bien-être", slug="bien-etre", description="Description")
        self.product = Product.objects.create(
            category=category,
            name="Thé test",
            slug="the-test",
            short_description="Une courte description",
            description="Description complète",
            price=Decimal("20.00"),
            stock_quantity=20,
        )
        QuantityDiscount.objects.create(product=self.product, quantity=2, percent=5, label="Duo")
        DeliveryRule.objects.create(product=self.product, min_quantity=2, max_quantity=2, fee=Decimal("2.00"), label="Livraison réduite")

    def payload(self):
        return {
            "customer_name": "Client VitalNova",
            "customer_email": "client@example.com",
            "customer_phone": "+243 999 000 111",
            "province": "kinshasa",
            "city": "Kinshasa",
            "district": "Gombe",
            "address": "Avenue du Commerce, numéro 10",
            "instructions": "Appeler avant la livraison",
            "items": [{"product_id": self.product.id, "quantity": 2}],
        }

    def test_server_recalculates_prices_discounts_and_delivery(self):
        response = self.client.post(reverse("order-list"), self.payload(), format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order = Order.objects.get()
        self.assertEqual(order.subtotal, Decimal("38.00"))
        self.assertEqual(order.delivery_fee, Decimal("2.00"))
        self.assertEqual(order.total, Decimal("40.00"))
        self.assertEqual(order.items.get().discount_percent, 5)

    def test_city_must_match_selected_province(self):
        payload = self.payload()
        payload["city"] = "Kolwezi"
        response = self.client.post(reverse("order-list"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Order.objects.count(), 0)

    def test_honeypot_rejects_automated_submission(self):
        payload = self.payload()
        payload["website"] = "https://spam.example"
        self.assertEqual(self.client.post(reverse("order-list"), payload, format="json").status_code, status.HTTP_400_BAD_REQUEST)
