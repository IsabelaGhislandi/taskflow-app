from django.urls import path
from .views import UserRegistrationView, UserProfileView, logout_view, user_profile_view

urlpatterns = [
    # Authentication
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('logout/', logout_view, name='user-logout'),
    
    # Profile management
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('me/', user_profile_view, name='user-me'),
]
