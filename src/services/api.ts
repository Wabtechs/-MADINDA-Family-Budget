import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('madinda-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('madinda-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

// Auth
export const authApi = {
  register: (data: { nom: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Families
export const familyApi = {
  list: () => api.get('/families'),
  create: (data: { nom_famille: string }) => api.post('/families', data),
  getById: (id: number) => api.get(`/families/${id}`),
  members: (id: number) => api.get(`/families/${id}/members`),
  addMember: (familyId: number, userId: number) =>
    api.post(`/families/${familyId}/members`, { user_id: userId }),
  removeMember: (familyId: number, userId: number) =>
    api.delete(`/families/${familyId}/members/${userId}`),
};

// Expenses
export const expenseApi = {
  list: (params: { family_id: number; start_date?: string; end_date?: string; category_id?: number; limit?: number; offset?: number }) =>
    api.get('/expenses', { params }),
  create: (data: { family_id: number; category_id: number; montant: number; description?: string; date: string }) =>
    api.post('/expenses', data),
  getById: (id: number) => api.get(`/expenses/${id}`),
  update: (id: number, data: Partial<{ category_id: number; montant: number; description: string; date: string }>) =>
    api.put(`/expenses/${id}`, data),
  delete: (id: number) => api.delete(`/expenses/${id}`),
  stats: (familyId: number) => api.get('/expenses/stats', { params: { family_id: familyId } }),
};

// Categories
export const categoryApi = {
  list: (type?: 'income' | 'expense') => api.get('/categories', { params: { type } }),
};

// Budgets
export const budgetApi = {
  list: (familyId: number) => api.get('/budgets', { params: { family_id: familyId } }),
  create: (data: { family_id: number; category_id?: number; montant: number; periode?: string }) =>
    api.post('/budgets', data),
  update: (id: number, data: Partial<{ montant: number; periode: string }>) =>
    api.put(`/budgets/${id}`, data),
  delete: (id: number) => api.delete(`/budgets/${id}`),
};
