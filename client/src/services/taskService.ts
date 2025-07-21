import api from './api';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  user: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  due_date: string | null;
  completed_at: string | null;
  is_overdue: boolean;
  days_until_due: number | null;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

// Auth services
export const authService = {
  login: async (data: LoginData) => {
    const response = await api.post('/token/', data);
    const { access, refresh } = response.data;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register/', data);
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
};

// Task services
export const taskService = {
  getTasks: async (params?: Record<string, any>) => {
    const response = await api.get('/tasks/', { params });
    return response.data;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}/`);
    return response.data;
  },

  createTask: async (data: TaskCreate): Promise<Task> => {
    const response = await api.post('/tasks/', data);
    return response.data;
  },

  updateTask: async (id: number, data: Partial<TaskCreate>): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/`, data);
    return response.data;
  },

  updateTaskStatus: async (id: number, status: Task['status']): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/update_status/`, { status });
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}/`);
  },

  getKanbanTasks: async () => {
    const response = await api.get('/tasks/kanban/');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/tasks/stats/');
    return response.data;
  },
};
