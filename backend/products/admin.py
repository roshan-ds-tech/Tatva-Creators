from django.contrib import admin
from .models import Product, SubDescription, ProductThumbnail, Review


class SubDescriptionInline(admin.TabularInline):
    model = SubDescription
    extra = 1


class ProductThumbnailInline(admin.TabularInline):
    model = ProductThumbnail
    extra = 1


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ['date']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'rating', 'in_stock', 'created_at']
    list_filter = ['category', 'in_stock', 'created_at']
    search_fields = ['name', 'description']
    inlines = [SubDescriptionInline, ProductThumbnailInline, ReviewInline]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user_name', 'rating', 'date']
    list_filter = ['rating', 'date']
    search_fields = ['user_name', 'comment']
