from decimal import Decimal

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Category(models.Model):
    title = models.CharField("titre", max_length=120)
    slug = models.SlugField(unique=True)
    description = models.CharField(max_length=240)
    background_image = models.ImageField(upload_to="categories/", blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("order", "title")
        verbose_name = "catégorie"

    def __str__(self):
        return self.title


class Product(models.Model):
    category = models.ForeignKey(Category, related_name="products", on_delete=models.PROTECT)
    name = models.CharField(max_length=180)
    slug = models.SlugField(unique=True)
    short_description = models.CharField(max_length=280)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))])
    image = models.ImageField(upload_to="products/", blank=True)
    specifications = models.JSONField(default=dict, blank=True)
    video_url = models.URLField(blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)
    is_demo = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-is_popular", "name")

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="gallery", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="products/gallery/")
    alt_text = models.CharField(max_length=180)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("order", "id")


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, related_name="variants", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=64, unique=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.product} — {self.name}"


class QuantityDiscount(models.Model):
    product = models.ForeignKey(Product, related_name="discounts", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(2)])
    percent = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(90)])
    label = models.CharField(max_length=80)

    class Meta:
        ordering = ("quantity",)
        constraints = [models.UniqueConstraint(fields=("product", "quantity"), name="unique_discount_quantity")]


class DeliveryRule(models.Model):
    product = models.ForeignKey(Product, related_name="delivery_rules", on_delete=models.CASCADE)
    min_quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    max_quantity = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1)])
    fee = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))])
    label = models.CharField(max_length=120)

    class Meta:
        ordering = ("min_quantity",)
        constraints = [
            models.CheckConstraint(
                condition=models.Q(max_quantity__isnull=True) | models.Q(max_quantity__gte=models.F("min_quantity")),
                name="delivery_max_gte_min",
            )
        ]
