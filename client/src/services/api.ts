// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de REQUEST (adiciona token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador de RESPONSE (trata erros)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login/', data); // ✅ /api/auth/login/
    return response.data;
  },

  getProfile: async (): Promise<any> => {
    const response = await api.get('/auth/profile/');
    return response.data;
  }

};

// NOVO: Tasks API (para depois)
export const tasksAPI = {
  getTasks: async () => {
    const response = await api.get('/tasks/');
    return response.data;
  },

  createTask: async (data: any) => {
    const response = await api.post('/tasks/', data);
    return response.data;
  },

  updateTask: async (id: number, data: any) => {
    const response = await api.patch(`/tasks/${id}/`, data);
    return response.data;
  },

  deleteTask: async (id: number) => {
    const response = await api.delete(`/tasks/${id}/`);
    return response.data;
  }
};

export default api;