from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    """Main serializer for Task model with read-only computed fields."""
    user = serializers.StringRelatedField(read_only=True)
    is_overdue = serializers.ReadOnlyField()
    days_until_due = serializers.ReadOnlyField()
    
    class Meta:
        model = Task
        fields = [
            'id', 'user', 'title', 'description', 'status', 'priority',
            'created_at', 'updated_at', 'due_date', 'completed_at',
            'is_overdue', 'days_until_due'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'completed_at']


class TaskCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new tasks with validation."""
    
    class Meta:
        model = Task
        fields = ['title', 'description', 'priority', 'due_date']
        
    def create(self, validated_data):
        task = Task.objects.create(**validated_data)
        return task
    
    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value


class TaskUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
            
        fields = ['title', 'description', 'priority', 'due_date', 'completed'] 
        
    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value


class TaskStatusUpdateSerializer(serializers.ModelSerializer):

    
    class Meta:
        model = Task
        fields = ['status']
    
    def validate_status(self, value):
      
        valid_statuses = [choice[0] for choice in Task.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Status must be one of: {', '.join(valid_statuses)}")
        return value
