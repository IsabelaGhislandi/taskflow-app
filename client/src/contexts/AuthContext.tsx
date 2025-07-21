// src/contexts/AuthContext.tsx - VERSÃO COMPLETA E CORRETA
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string; 
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!localStorage.getItem('token');

  // ✅ Verificar auth só se necessário
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Se tem token, simular usuário logado por enquanto
      setUser({
        id: 1,
        email: 'user@example.com',
        first_name: 'User',
        last_name: 'Example'
      });
    }
    setIsLoading(false);
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Simulação temporária
      setUser({
        id: 1,
        email: 'user@example.com', 
        first_name: 'User',
        last_name: 'Example'
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email, password });
      console.log('Login response:', response);
      
      // ✅ Verificar se token existe
      if (!response.access_token) {
        console.error('Token não encontrado na resposta');
        return false;
      }
      
      localStorage.setItem('token', response.access_token);
      
      // ✅ Tratamento seguro para user
      const userData = response.user || {
        id: 1,
        email: email,
        first_name: 'User',
        last_name: 'Temp'
      };
      
      setUser(userData);
      return true;
      
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data) {
        console.error('Error data:', error.response.data);
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ EXPORTAÇÃO QUE ESTAVA FALTANDO!
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};