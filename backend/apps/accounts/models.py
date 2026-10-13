from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models


phone_validator = RegexValidator(
    regex=r"^\+?[0-9][0-9\s().-]{7,24}$",
    message="Saisissez un numéro de téléphone valide.",
)


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L’adresse e-mail est obligatoire.")
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        if not extra_fields.get("is_staff") or not extra_fields.get("is_superuser"):
            raise ValueError("Un superutilisateur doit avoir is_staff et is_superuser à True.")
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None
    email = models.EmailField("adresse e-mail", unique=True)
    full_name = models.CharField("nom complet", max_length=160)
    phone = models.CharField("téléphone", max_length=32, blank=True, validators=[phone_validator])
    email_verified = models.BooleanField("e-mail vérifié", default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]
    objects = UserManager()

    def save(self, *args, **kwargs):
        self.email = self.__class__.objects.normalize_email(self.email).lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email
