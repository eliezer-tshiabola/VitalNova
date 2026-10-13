from django.db.models import Prefetch
from rest_framework import filters, permissions, viewsets

from .models import Category, Product, ProductVariant
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)
    lookup_field = "slug"
    queryset = Category.objects.filter(is_active=True)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_field = "slug"
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = ("name", "short_description", "category__title")
    ordering_fields = ("name", "price", "created_at")
    ordering = ("-is_popular", "name")

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True, category__is_active=True).select_related("category").prefetch_related(
            "gallery", "discounts", "delivery_rules",
            Prefetch("variants", queryset=ProductVariant.objects.filter(is_active=True)),
        )
        category = self.request.query_params.get("category", "").strip()
        if category:
            queryset = queryset.filter(category__slug=category)
        popular = self.request.query_params.get("popular", "").lower()
        if popular in {"true", "1"}:
            queryset = queryset.filter(is_popular=True)
        return queryset
