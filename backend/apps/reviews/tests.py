from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.catalog.models import Category, Product
from apps.orders.models import Order, OrderItem

from .models import Review


class ReviewApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email="reviewer@example.com", full_name="Client Vérifié", password="Une-phrase-secrete-2026!", email_verified=True
        )
        category = Category.objects.create(title="Bien-être", slug="bien-etre", description="Description")
        self.product = Product.objects.create(
            category=category, name="Produit évalué", slug="produit-evalue", short_description="Description courte",
            description="Description", price=Decimal("20.00"), stock_quantity=10,
        )
        self.order = Order.objects.create(
            user=self.user, status=Order.Status.DELIVERED, customer_name=self.user.full_name,
            customer_phone="+243999000111", province=Order.Province.KINSHASA, city="Kinshasa",
            district="Gombe", address="Avenue du Commerce 10", subtotal=Decimal("20.00"), total=Decimal("20.00"),
        )
        self.item = OrderItem.objects.create(
            order=self.order, product=self.product, product_name=self.product.name, product_slug=self.product.slug,
            quantity=1, base_unit_price=Decimal("20.00"), unit_price=Decimal("20.00"), line_total=Decimal("20.00"),
        )
        self.client.force_authenticate(self.user)

    def test_review_requires_a_delivered_order_owned_by_user(self):
        response = self.client.post(reverse("review-list"), {
            "order_item_id": self.item.id,
            "rating": 5,
            "title": "Très satisfait",
            "comment": "Produit reçu dans de bonnes conditions.",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.get().product, self.product)

    def test_review_is_rejected_before_delivery(self):
        self.order.status = Order.Status.CONFIRMED
        self.order.save(update_fields=("status",))
        response = self.client.post(reverse("review-list"), {
            "order_item_id": self.item.id,
            "rating": 4,
            "title": "Trop tôt",
            "comment": "Cette commande n’est pas encore arrivée.",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
