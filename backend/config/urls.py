from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenVerifyView

from apps.accounts.views import (
    LoginView,
    LogoutView,
    MeView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    RefreshView,
    RegisterView,
    VerificationRequestView,
    VerifyEmailView,
)
from apps.catalog.views import CategoryViewSet, ProductViewSet
from apps.common.throttles import AuthRateThrottle
from apps.common.views import health
from apps.orders.views import OrderViewSet
from apps.reviews.views import ReviewViewSet


class VerifyView(TokenVerifyView):
    throttle_classes = (AuthRateThrottle,)


router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("products", ProductViewSet, basename="product")
router.register("orders", OrderViewSet, basename="order")
router.register("reviews", ReviewViewSet, basename="review")

admin.site.site_header = "Administration VitalNova"
admin.site.site_title = "VitalNova"
admin.site.index_title = "Gestion de la boutique"

urlpatterns = [
    path(settings.ADMIN_PATH, admin.site.urls),
    path("api/v1/health/", health, name="health"),
    path("api/v1/auth/register/", RegisterView.as_view(), name="register"),
    path("api/v1/auth/login/", LoginView.as_view(), name="login"),
    path("api/v1/auth/refresh/", RefreshView.as_view(), name="token-refresh"),
    path("api/v1/auth/verify/", VerifyView.as_view(), name="token-verify"),
    path("api/v1/auth/logout/", LogoutView.as_view(), name="logout"),
    path("api/v1/auth/me/", MeView.as_view(), name="me"),
    path("api/v1/auth/verify-email/request/", VerificationRequestView.as_view(), name="verify-email-request"),
    path("api/v1/auth/verify-email/confirm/", VerifyEmailView.as_view(), name="verify-email-confirm"),
    path("api/v1/auth/password-reset/request/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("api/v1/auth/password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("api/v1/", include(router.urls)),
]
