from rest_framework import serializers
from .models import Product, SubDescription, ProductThumbnail, Review


class SubDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubDescription
        fields = ['title', 'body']


class ProductThumbnailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductThumbnail
        fields = ['image_url']


class ReviewSerializer(serializers.ModelSerializer):
    userName = serializers.CharField(source='user_name', required=False, read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'userName', 'rating', 'comment', 'date']
        read_only_fields = ['id', 'date', 'userName']
    
    def to_representation(self, instance):
        """Convert user_name to userName in response and format date"""
        ret = super().to_representation(instance)
        ret['userName'] = instance.user_name
        # Format date as string if it's a datetime object
        if hasattr(instance.date, 'strftime'):
            ret['date'] = instance.date.strftime('%Y-%m-%d')
        elif ret.get('date'):
            ret['date'] = str(ret['date'])
        return ret


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model"""
    sub_descriptions = serializers.SerializerMethodField()
    thumbnails = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    inStock = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'price', 'image', 'alt',
            'description', 'main_description', 'sub_descriptions',
            'dimensions', 'material', 'weight', 'inStock',
            'thumbnails', 'reviews', 'rating', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'rating']
    
    def get_inStock(self, obj):
        """Return in_stock as inStock for frontend compatibility"""
        return obj.in_stock
    
    def get_thumbnails(self, obj):
        """Get thumbnail URLs as a list"""
        thumbnails = obj.thumbnails.all().order_by('order')
        return [thumb.image_url for thumb in thumbnails]
    
    def get_sub_descriptions(self, obj):
        """Get sub-descriptions as a list of dicts"""
        sub_descs = obj.sub_descriptions.all().order_by('order')
        return [{'title': sub.title, 'body': sub.body} for sub in sub_descs]
    
    def get_reviews(self, obj):
        """Get reviews as a list"""
        reviews = obj.reviews.all().order_by('-date')
        return ReviewSerializer(reviews, many=True).data
    
    def create(self, validated_data):
        """Create product with nested sub-descriptions, thumbnails, and reviews"""
        # Get nested data from initial_data since they're SerializerMethodFields
        sub_descriptions_data = self.initial_data.get('sub_descriptions', [])
        thumbnails_data = self.initial_data.get('thumbnails', [])
        reviews_data = self.initial_data.get('reviews', [])
        
        # Handle inStock -> in_stock conversion (frontend sends inStock, model uses in_stock)
        if 'inStock' in self.initial_data:
            validated_data['in_stock'] = self.initial_data.get('inStock', True)
        elif 'in_stock' not in validated_data:
            validated_data['in_stock'] = True  # Default to True
        
        product = Product.objects.create(**validated_data)
        
        # Create sub-descriptions
        for idx, sub_desc_data in enumerate(sub_descriptions_data):
            if sub_desc_data and (sub_desc_data.get('title') or sub_desc_data.get('body')):
                SubDescription.objects.create(
                    product=product,
                    title=sub_desc_data.get('title', ''),
                    body=sub_desc_data.get('body', ''),
                    order=idx
                )
        
        # Create thumbnails
        for idx, thumbnail_url in enumerate(thumbnails_data):
            if thumbnail_url:  # Only add non-empty URLs
                ProductThumbnail.objects.create(
                    product=product,
                    image_url=thumbnail_url,
                    order=idx
                )
        
        # Create reviews
        for review_data in reviews_data:
            if review_data and review_data.get('comment'):
                from .models import Review
                Review.objects.create(
                    product=product,
                    user_name=review_data.get('userName') or review_data.get('user_name', 'Anonymous'),
                    rating=review_data.get('rating', 5),
                    comment=review_data.get('comment', '')
                )
        
        return product
    
    def update(self, instance, validated_data):
        """Update product with nested sub-descriptions, thumbnails, and reviews"""
        # Get nested data from initial_data since they're SerializerMethodFields
        # Handle both snake_case and camelCase for sub_descriptions
        sub_descriptions_data = self.initial_data.get('sub_descriptions', None)
        if sub_descriptions_data is None:
            sub_descriptions_data = self.initial_data.get('subDescriptions', None)
        
        thumbnails_data = self.initial_data.get('thumbnails', None)
        reviews_data = self.initial_data.get('reviews', None)
        
        # Handle inStock -> in_stock conversion
        if 'inStock' in self.initial_data:
            instance.in_stock = self.initial_data.get('inStock', True)
        
        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update sub-descriptions if provided
        if sub_descriptions_data is not None:
            # Delete existing sub-descriptions
            instance.sub_descriptions.all().delete()
            # Create new ones
            for idx, sub_desc_data in enumerate(sub_descriptions_data):
                if sub_desc_data and (sub_desc_data.get('title') or sub_desc_data.get('body')):
                    SubDescription.objects.create(
                        product=instance,
                        title=sub_desc_data.get('title', ''),
                        body=sub_desc_data.get('body', ''),
                        order=idx
                    )
        
        # Update thumbnails if provided
        if thumbnails_data is not None:
            # Delete existing thumbnails
            instance.thumbnails.all().delete()
            # Create new ones
            for idx, thumbnail_url in enumerate(thumbnails_data):
                if thumbnail_url:  # Only add non-empty URLs
                    ProductThumbnail.objects.create(
                        product=instance,
                        image_url=thumbnail_url,
                        order=idx
                    )
        
        # Update reviews if provided (even if empty array, to clear reviews)
        if reviews_data is not None:
            from .models import Review
            # Delete existing reviews
            instance.reviews.all().delete()
            # Create new ones if provided
            if isinstance(reviews_data, list) and len(reviews_data) > 0:
                for review_data in reviews_data:
                    if review_data and review_data.get('comment'):
                        Review.objects.create(
                            product=instance,
                            user_name=review_data.get('userName') or review_data.get('user_name', 'Anonymous'),
                            rating=review_data.get('rating', 5),
                            comment=review_data.get('comment', '')
                        )
            # Recalculate product rating
            reviews = instance.reviews.all()
            if reviews:
                avg_rating = sum(r.rating for r in reviews) / len(reviews)
                instance.rating = round(avg_rating, 2)
            else:
                instance.rating = 5.0  # Default rating if no reviews
            instance.save()
        
        return instance


class ProductListSerializer(serializers.ModelSerializer):
    """Simplified serializer for product lists"""
    inStock = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'price', 'image', 'alt', 'rating', 'inStock'
        ]
    
    def get_inStock(self, obj):
        """Return in_stock as inStock for frontend compatibility"""
        return obj.in_stock

