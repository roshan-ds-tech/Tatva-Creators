from django.db import models
import json


class Product(models.Model):
    """Product Model"""
    
    CATEGORY_CHOICES = [
        ('Photo Frames', 'Photo Frames'),
        ('Idols', 'Idols'),
        ('Home Interiors', 'Home Interiors'),
        ('Corporate Gifts', 'Corporate Gifts'),
    ]
    
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(max_length=500)
    alt = models.CharField(max_length=255, default='')
    description = models.TextField(blank=True, null=True)
    main_description = models.TextField(blank=True, null=True)
    dimensions = models.CharField(max_length=100, blank=True, null=True)
    material = models.CharField(max_length=100, blank=True, null=True)
    weight = models.CharField(max_length=50, blank=True, null=True)
    in_stock = models.BooleanField(default=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'products'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class SubDescription(models.Model):
    """Sub-descriptions for products"""
    product = models.ForeignKey(Product, related_name='sub_descriptions', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    body = models.TextField()
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'product_sub_descriptions'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.product.name} - {self.title}"


class ProductThumbnail(models.Model):
    """Thumbnail images for products"""
    product = models.ForeignKey(Product, related_name='thumbnails', on_delete=models.CASCADE)
    image_url = models.URLField(max_length=500)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'product_thumbnails'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.product.name} - Thumbnail {self.order}"


class Review(models.Model):
    """Product reviews"""
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user_name = models.CharField(max_length=100)
    rating = models.IntegerField()
    comment = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'product_reviews'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.product.name} - {self.user_name} ({self.rating} stars)"
