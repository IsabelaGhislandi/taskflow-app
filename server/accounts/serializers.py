from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
  
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'name', 'date_joined']
    
    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class UserRegistrationSerializer(serializers.ModelSerializer):
   
    password = serializers.CharField(
        write_only=True, 
        min_length=8,
        help_text="Password must be at least 8 characters long"
    )
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm']
        
    def validate_email(self, value):
     
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value

    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name']
        
    def update(self, instance, validated_data):
       
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        return instance
