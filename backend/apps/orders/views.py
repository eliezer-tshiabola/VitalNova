from rest_framework import mixins, permissions, viewsets

from apps.common.throttles import CheckoutRateThrottle

from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer


class OrderViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    lookup_field = "number"
    lookup_value_converter = "uuid"

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Order.objects.none()
        queryset = Order.objects.prefetch_related("items")
        return queryset if self.request.user.is_staff else queryset.filter(user=self.request.user)

    def get_serializer_class(self):
        return OrderCreateSerializer if self.action == "create" else OrderSerializer

    def get_permissions(self):
        return [permissions.AllowAny()] if self.action == "create" else [permissions.IsAuthenticated()]

    def get_throttles(self):
        return [CheckoutRateThrottle()] if self.action == "create" else super().get_throttles()
