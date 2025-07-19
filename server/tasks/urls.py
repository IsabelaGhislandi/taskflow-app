from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

# Router for ViewSets
router = DefaultRouter()
router.register(r'', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]
