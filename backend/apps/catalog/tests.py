from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Product


class CatalogApiTests(APITestCase):
    def setUp(self):
        category = Category.objects.create(title="Bien-être", slug="bien-etre", description="Description")
        self.product = Product.objects.create(
            category=category,
            name="Produit test",
            slug="produit-test",
            short_description="Une courte description",
            description="Description complète",
            price=Decimal("20.00"),
            stock_quantity=10,
        )

    def test_catalog_is_public_and_read_only(self):
        response = self.client.get(reverse("product-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"][0]["slug"], self.product.slug)
        self.assertEqual(self.client.post(reverse("product-list"), {}).status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
