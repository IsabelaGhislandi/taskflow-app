from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
       
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, first_name, last_name, password, **extra_fields)


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(
        unique=True,
        verbose_name='Email Address'
    )

    first_name = models.CharField(
        max_length=50,
        verbose_name='First Name'
    )
    last_name = models.CharField(
        max_length=50,
        verbose_name='Last Name'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    @property
    def full_name(self):

        return f"{self.first_name} {self.last_name}".strip()
