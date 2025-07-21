from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated  
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .models import CustomUser
from .serializers import UserSerializer, UserRegistrationSerializer
from rest_framework import generics, status, permissions

class UserRegistrationView(generics.CreateAPIView):
 
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        

        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User created successfully!'
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return UserSerializer
        return UserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    try:
        data = request.data
        if CustomUser.objects.filter(email=data.get('email')).exists():
            return Response({
                'email': ['Este email já está cadastrado.']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if data.get('password') != data.get('password_confirm'):
            return Response({
                'password_confirm': ['Senhas não coincidem.']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = CustomUser.objects.create(
            email=data.get('email'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            password=make_password(data.get('password'))
        )

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
            
        return Response({
        'access_token': str(access_token),
        'refresh_token': str(refresh),
        'user': {  
            'id': user.id,
            'name': f"{user.first_name} {user.last_name}".strip(),
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login de usuário"""
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email e senha são obrigatórios.'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)
        
        if not user:
            return Response({
                'error': 'Credenciais inválidas.'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        """ Gerar tokens """
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return Response({
            'access_token': str(access_token),
            'refresh_token': str(refresh),
            'user': {
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}",
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Perfil do usuário"""
    user = request.user
    return Response({
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'name': f"{user.first_name} {user.last_name}",
        'date_joined': user.date_joined
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout do usuário"""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Logout realizado com sucesso.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'message': 'Logout realizado com sucesso.'
        }, status=status.HTTP_200_OK)