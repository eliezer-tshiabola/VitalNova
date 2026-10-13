from rest_framework import mixins, permissions, viewsets

from apps.common.throttles import ReviewRateThrottle

from .models import Review
from .serializers import ReviewCreateSerializer, ReviewSerializer


class ReviewViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Review.objects.filter(is_approved=True).select_related("user", "product", "order_item__order")

    def get_serializer_class(self):
        return ReviewCreateSerializer if self.action == "create" else ReviewSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()] if self.action == "create" else [permissions.AllowAny()]

    def get_throttles(self):
        return [ReviewRateThrottle()] if self.action == "create" else super().get_throttles()

    def get_queryset(self):
        queryset = super().get_queryset()
        product = self.request.query_params.get("product", "").strip()
        return queryset.filter(product__slug=product) if product else queryset
