import os

from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F403

if len(SECRET_KEY) < 64:  # noqa: F405
    raise ImproperlyConfigured("DJANGO_SECRET_KEY doit contenir au moins 64 caractères aléatoires.")
if not ALLOWED_HOSTS:  # noqa: F405
    raise ImproperlyConfigured("DJANGO_ALLOWED_HOSTS est obligatoire en production.")
if not os.getenv("DATABASE_URL", "").startswith(("postgres://", "postgresql://")):
    raise ImproperlyConfigured("Une base PostgreSQL DATABASE_URL est obligatoire en production.")
if not REDIS_URL:  # noqa: F405
    raise ImproperlyConfigured("REDIS_URL est obligatoire en production pour le cache et la limitation de débit.")
if not all((EMAIL_HOST, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, DEFAULT_FROM_EMAIL)):  # noqa: F405
    raise ImproperlyConfigured("La configuration SMTP est obligatoire en production.")

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

SECURE_SSL_REDIRECT = os.getenv("DJANGO_SECURE_SSL_REDIRECT", "true").lower() == "true"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31_536_000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
