from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import base64
import uuid
from .models import Product, Review
from .serializers import ProductSerializer, ProductListSerializer, ReviewSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product CRUD operations
    - GET /api/products/ - List all products (public)
    - GET /api/products/{id}/ - Get product details (public)
    - POST /api/products/ - Create product (requires authentication)
    - PUT /api/products/{id}/ - Update product (requires authentication)
    - DELETE /api/products/{id}/ - Delete product (requires authentication)
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        """
        Allow anyone to read products, but require authentication for write operations
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        """Use different serializer for list vs detail"""
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer
    
    def list(self, request, *args, **kwargs):
        """List all products"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, *args, **kwargs):
        """Get single product details"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        """Create a new product"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        """Update a product"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Delete a product"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def add_review(self, request, pk=None):
        """Add a review to a product"""
        product = self.get_object()
        # Handle both userName (frontend) and user_name (backend)
        user_name = request.data.get('userName') or request.data.get('user_name', 'Anonymous')
        review_data = {
            'user_name': user_name,
            'rating': request.data.get('rating', 5),
            'comment': request.data.get('comment', ''),
        }
        serializer = ReviewSerializer(data=review_data)
        if serializer.is_valid():
            review = Review.objects.create(
                product=product,
                user_name=user_name,
                rating=review_data['rating'],
                comment=review_data['comment']
            )
            # Recalculate product rating
            reviews = product.reviews.all()
            if reviews:
                avg_rating = sum(r.rating for r in reviews) / len(reviews)
                product.rating = round(avg_rating, 2)
                product.save()
            return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])  # Allow unauthenticated uploads for easier admin access
def upload_image(request):
    """
    Upload an image file and return its URL
    Accepts:
    - multipart/form-data with 'image' file field
    - OR JSON with 'image' as base64 data URL
    """
    try:
        # Check if it's a file upload (multipart/form-data)
        if 'image' in request.FILES:
            uploaded_file = request.FILES['image']
            
            # Generate unique filename
            file_extension = uploaded_file.name.split('.')[-1] if '.' in uploaded_file.name else 'jpg'
            filename = f"products/{uuid.uuid4()}.{file_extension}"
            
            # Save file
            saved_path = default_storage.save(filename, uploaded_file)
            
            # Get URL - construct proper media URL
            # Remove leading slash from MEDIA_URL if present, then add saved_path
            media_url = settings.MEDIA_URL.lstrip('/')
            file_url = request.build_absolute_uri(f"/{media_url}{saved_path}")
            
            return Response({
                'url': file_url,
                'message': 'Image uploaded successfully'
            }, status=status.HTTP_201_CREATED)
        
        # Check if it's base64 data URL (JSON)
        elif 'image' in request.data:
            image_data = request.data['image']
            
            # Handle base64 data URL
            if isinstance(image_data, str) and image_data.startswith('data:image'):
                # Extract base64 data
                header, encoded = image_data.split(',', 1)
                image_format = header.split('/')[1].split(';')[0]  # e.g., 'png', 'jpeg'
                
                # Decode base64
                image_bytes = base64.b64decode(encoded)
                
                # Generate unique filename
                filename = f"products/{uuid.uuid4()}.{image_format}"
                
                # Save file
                saved_path = default_storage.save(filename, ContentFile(image_bytes))
                
                # Get URL - construct proper media URL
                # Remove leading slash from MEDIA_URL if present, then add saved_path
                media_url = settings.MEDIA_URL.lstrip('/')
                file_url = request.build_absolute_uri(f"/{media_url}{saved_path}")
                
                return Response({
                    'url': file_url,
                    'message': 'Image uploaded successfully'
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'error': 'Invalid image data. Expected base64 data URL or file upload.'
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                'error': 'No image provided. Send "image" field with file or base64 data.'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'error': f'Failed to upload image: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
