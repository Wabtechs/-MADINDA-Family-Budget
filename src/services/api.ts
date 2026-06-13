import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
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

export const authApi = {
  register: (data: { nom: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: Partial<{ nom: string; email: string; avatar: string; phone: string }>) =>
    api.put('/auth/profile', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; password: string }) => api.post('/auth/reset-password', data),
};

export const entityApi = {
  list: () => api.get('/entities'),
  create: (data: { name: string; type: string; currency?: string; description?: string }) =>
    api.post('/entities', data),
  getById: (id: number) => api.get(`/entities/${id}`),
  update: (id: number, data: Partial<{ name: string; type: string; currency: string; description: string; is_active: boolean }>) =>
    api.put(`/entities/${id}`, data),
  delete: (id: number) => api.delete(`/entities/${id}`),
  getMembers: (id: number) => api.get(`/entities/${id}/members`),
  addMember: (entityId: number, data: { user_id: number; role?: string }) =>
    api.post(`/entities/${entityId}/members`, data),
  updateMember: (entityId: number, userId: number, data: { role: string }) =>
    api.put(`/entities/${entityId}/members/${userId}`, data),
  removeMember: (entityId: number, userId: number) =>
    api.delete(`/entities/${entityId}/members/${userId}`),
};

export const accountApi = {
  list: (entityId: number) => api.get('/accounts', { params: { entity_id: entityId } }),
  create: (data: { entity_id: number; name: string; type: string; balance?: number; currency?: string; bank_name?: string; description?: string }) =>
    api.post('/accounts', data),
  getById: (id: number) => api.get(`/accounts/${id}`),
  update: (id: number, data: Partial<{ name: string; type: string; balance: number; bank_name: string; description: string; is_active: boolean }>) =>
    api.put(`/accounts/${id}`, data),
  delete: (id: number) => api.delete(`/accounts/${id}`),
  transfer: (data: { from_account_id: number; to_account_id: number; amount: number; description?: string; date?: string }) =>
    api.post('/accounts/transfer', data),
};

export const incomeApi = {
  list: (params: { entity_id: number; start_date?: string; end_date?: string; category_id?: number; account_id?: number; limit?: number; offset?: number }) =>
    api.get('/incomes', { params }),
  create: (data: { entity_id: number; account_id: number; category_id: number; amount: number; description?: string; date: string }) =>
    api.post('/incomes', data),
  getById: (id: number) => api.get(`/incomes/${id}`),
  update: (id: number, data: Partial<{ account_id: number; category_id: number; amount: number; description: string; date: string }>) =>
    api.put(`/incomes/${id}`, data),
  delete: (id: number) => api.delete(`/incomes/${id}`),
  stats: (entityId: number) => api.get('/incomes/stats', { params: { entity_id: entityId } }),
};

export const expenseApi = {
  list: (params: { entity_id: number; start_date?: string; end_date?: string; category_id?: number; account_id?: number; limit?: number; offset?: number }) =>
    api.get('/expenses', { params }),
  create: (data: { entity_id: number; account_id: number; category_id: number; amount: number; description?: string; date: string }) =>
    api.post('/expenses', data),
  getById: (id: number) => api.get(`/expenses/${id}`),
  update: (id: number, data: Partial<{ account_id: number; category_id: number; amount: number; description: string; date: string }>) =>
    api.put(`/expenses/${id}`, data),
  delete: (id: number) => api.delete(`/expenses/${id}`),
  stats: (entityId: number) => api.get('/expenses/stats', { params: { entity_id: entityId } }),
};

export const transferApi = {
  list: (params: { entity_id: number; start_date?: string; end_date?: string; limit?: number; offset?: number }) =>
    api.get('/transfers', { params }),
  create: (data: { entity_id: number; from_account_id: number; to_account_id: number; amount: number; description?: string; date: string }) =>
    api.post('/transfers', data),
  getById: (id: number) => api.get(`/transfers/${id}`),
};

export const categoryApi = {
  list: (params?: { type?: 'income' | 'expense'; entity_id?: number }) =>
    api.get('/categories', { params }),
};

export const budgetApi = {
  list: (entityId: number) => api.get('/budgets', { params: { entity_id: entityId } }),
  create: (data: { entity_id: number; category_id?: number; name: string; amount: number; period?: string; start_date?: string; end_date?: string }) =>
    api.post('/budgets', data),
  getById: (id: number) => api.get(`/budgets/${id}`),
  update: (id: number, data: Partial<{ name: string; amount: number; period: string; start_date: string; end_date: string; spent: number }>) =>
    api.put(`/budgets/${id}`, data),
  delete: (id: number) => api.delete(`/budgets/${id}`),
};

export const goalApi = {
  list: (entityId: number) => api.get('/goals', { params: { entity_id: entityId } }),
  create: (data: { entity_id: number; name: string; target_amount: number; current_amount?: number; deadline?: string; description?: string }) =>
    api.post('/goals', data),
  getById: (id: number) => api.get(`/goals/${id}`),
  update: (id: number, data: Partial<{ name: string; target_amount: number; current_amount: number; deadline: string; status: string; description: string }>) =>
    api.put(`/goals/${id}`, data),
  delete: (id: number) => api.delete(`/goals/${id}`),
};

export const debtApi = {
  list: (entityId: number) => api.get('/debts', { params: { entity_id: entityId } }),
  create: (data: { entity_id: number; type: string; contact_name: string; amount: number; description?: string; due_date?: string }) =>
    api.post('/debts', data),
  getById: (id: number) => api.get(`/debts/${id}`),
  update: (id: number, data: Partial<{ contact_name: string; amount: number; remaining_amount: number; description: string; due_date: string; status: string }>) =>
    api.put(`/debts/${id}`, data),
  delete: (id: number) => api.delete(`/debts/${id}`),
  addPayment: (debtId: number, data: { amount: number; payment_date: string; note?: string }) =>
    api.post(`/debts/${debtId}/payments`, data),
  getPayments: (debtId: number) => api.get(`/debts/${debtId}/payments`),
};

export const notificationApi = {
  list: (params?: { is_read?: boolean; limit?: number; offset?: number }) =>
    api.get('/notifications', { params }),
  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  unreadCount: () => api.get('/notifications/unread-count'),
};

export const documentApi = {
  list: (entityId: number) => api.get('/documents', { params: { entity_id: entityId } }),
  create: (data: FormData) => api.post('/documents', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`/documents/${id}`),
};

export const dashboardApi = {
  getDashboard: (entityId: number) => api.get('/dashboard', { params: { entity_id: entityId } }),
};

export const reportApi = {
  monthly: (params: { entity_id: number; year: number }) =>
    api.get('/reports/monthly', { params }),
  annual: (params: { entity_id: number; year: number }) =>
    api.get('/reports/annual', { params }),
  categories: (params: { entity_id: number; start_date: string; end_date: string }) =>
    api.get('/reports/categories', { params }),
};

export const auditApi = {
  list: (params?: { entity_id?: number; limit?: number; offset?: number }) =>
    api.get('/audit-logs', { params }),
};
