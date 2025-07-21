from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone
from .models import Task
from .serializers import (
    TaskSerializer, 
    TaskCreateSerializer, 
    TaskUpdateSerializer,
    TaskStatusUpdateSerializer
)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'created_at', 'due_date']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'due_date', 'priority']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TaskCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TaskUpdateSerializer
        return TaskSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        task = self.get_object()
        serializer = TaskStatusUpdateSerializer(task, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(TaskSerializer(task).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Re-serializa com TaskSerializer para garantir que o id venha na resposta
        task = serializer.instance
        response_serializer = TaskSerializer(task, context={'request': request})
        headers = self.get_success_headers(serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
   
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Return overdue tasks."""
        queryset = self.get_queryset().filter(
            due_date__lt=timezone.now(),
            status__in=['todo', 'in_progress']
        )
        
        serializer = TaskSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'todo': queryset.filter(status='todo').count(),
            'in_progress': queryset.filter(status='in_progress').count(),
            'done': queryset.filter(status='done').count(),
            'high_priority': queryset.filter(priority='high').count(),
            'overdue': queryset.filter(
                due_date__lt=timezone.now(),
                status__in=['todo', 'in_progress']
            ).count()
        }
        
        return Response(stats)
