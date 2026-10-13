from .base import *  # noqa: F403

DEBUG = True
SECRET_KEY = SECRET_KEY or "development-only-secret-key-never-use-in-production-123456789"  # noqa: F405
ALLOWED_HOSTS = ALLOWED_HOSTS or ["localhost", "127.0.0.1"]  # noqa: F405
MIDDLEWARE = [item for item in MIDDLEWARE if item != "whitenoise.middleware.WhiteNoiseMiddleware"]  # noqa: F405
CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS or [  # noqa: F405
    "http://localhost:5173",
    "http://127.0.0.1:4173",
]
DEFAULT_FROM_EMAIL = DEFAULT_FROM_EMAIL or "VitalNova <no-reply@localhost>"  # noqa: F405
