from django.utils import timezone

class TaskService:
    @staticmethod
    def get_overdue_tasks(queryset):
        return queryset.filter(
            due_date__lt=timezone.now(),
            status__in=['todo', 'in_progress']
        )

    @staticmethod
    def get_stats(queryset):
        return {
            'total': queryset.count(),
            'todo': queryset.filter(status='todo').count(),
            'in_progress': queryset.filter(status='in_progress').count(),
            'done': queryset.filter(status='done').count(),
            'high_priority': queryset.filter(priority='high').count(),
            'overdue': TaskService.get_overdue_tasks(queryset).count()
        } 