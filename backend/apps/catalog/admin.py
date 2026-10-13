from django.contrib import admin

from .models import Category, DeliveryRule, Product, ProductImage, ProductVariant, QuantityDiscount


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0


class QuantityDiscountInline(admin.TabularInline):
    model = QuantityDiscount
    extra = 0


class DeliveryRuleInline(admin.TabularInline):
    model = DeliveryRule
    extra = 0


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_active", "order")
    list_editable = ("is_active", "order")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "stock_quantity", "is_active", "is_popular")
    list_filter = ("category", "is_active", "is_popular", "is_demo")
    list_editable = ("price", "stock_quantity", "is_active", "is_popular")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("created_at", "updated_at")
    inlines = (ProductImageInline, ProductVariantInline, QuantityDiscountInline, DeliveryRuleInline)
