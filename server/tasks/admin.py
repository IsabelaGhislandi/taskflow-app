from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """Admin configuration for Task model."""
    
    list_display = ['title', 'user', 'status', 'priority', 'due_date', 'created_at']
    list_filter = ['status', 'priority', 'created_at', 'due_date']
    search_fields = ['title', 'description', 'user__email']
    list_editable = ['status', 'priority']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('user', 'title', 'description')}),
        ('Task Details', {'fields': ('status', 'priority', 'due_date')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at', 'completed_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
    
    def get_queryset(self, request):
        """Optimize queryset with select_related."""
        return super().get_queryset(request).select_related('user')
