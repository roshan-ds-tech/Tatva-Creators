from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import SignupView, login_view, user_profile

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', login_view, name='login'),
    path('profile/', user_profile, name='user_profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]


