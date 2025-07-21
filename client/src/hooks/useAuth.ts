// src/hooks/useAuth.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import type { RegisterData, LoginData } from '../services/api';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setErrors([]);

    try {
      const response = await authAPI.register(data);
      localStorage.setItem('token', response.access_token);
      navigate('/dashboard');
    } catch (error: any) {
      // Melhorar tratamento de erro 400
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        const errorMessages: string[] = [];
        
        // Converter erros do Django para array
        Object.keys(errorData).forEach(field => {
          if (Array.isArray(errorData[field])) {
            errorMessages.push(`${field}: ${errorData[field].join(', ')}`);
          }
        });
        
        setErrors(errorMessages);
      } else {
        setErrors(['Erro ao criar conta']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setErrors([]);

    try {
      const response = await authAPI.login(data);
      localStorage.setItem('token', response.access_token);
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      setErrors([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

   return { register, login, isLoading, errors };

}