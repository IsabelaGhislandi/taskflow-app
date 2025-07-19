from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError


class Task(models.Model):
    
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    # Relationships
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tasks',
        verbose_name='User'
    )
    
    # Main fields
    title = models.CharField(
        max_length=200,
        verbose_name='Task Title'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Description'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='todo',
        verbose_name='Status'
    )
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium',
        verbose_name='Priority'
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Created At'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Updated At'
    )
    due_date = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Due Date'
    )
    completed_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Completed At'
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'
        
    def __str__(self):
        return f"{self.title} ({self.user.email})"
    
    def save(self, *args, **kwargs):
        """Override save to handle completed_at field automatically."""
        if self.status == 'done' and not self.completed_at:
            self.completed_at = timezone.now()
        elif self.status != 'done':
            self.completed_at = None
        super().save(*args, **kwargs)
    
    def clean(self):
        """Model validation."""
        super().clean()
        if self.due_date and self.created_at and self.due_date <= self.created_at:
            raise ValidationError("Due date must be in the future.")
        
        if not self.title.strip() if self.title else False:
            raise ValidationError("Title cannot be empty.")
    
    @property
    def is_overdue(self):
        """Check if task is overdue."""
        if self.due_date and self.status != 'done':
            return timezone.now() > self.due_date
        return False
    
    @property
    def days_until_due(self):
        """Calculate days until due date."""
        if self.due_date:
            delta = self.due_date.date() - timezone.now().date()
            return delta.days
        return None
