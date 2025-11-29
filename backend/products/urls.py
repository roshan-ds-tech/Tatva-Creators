from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, upload_image

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('upload-image/', upload_image, name='upload_image'),
    path('', include(router.urls)),
]

