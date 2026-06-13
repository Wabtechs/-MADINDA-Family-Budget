import { create } from 'zustand';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (nom: string, email: string, password: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('madinda-token'),
  loading: false,
  initialized: false,

  setAuth: (user, token) => {
    localStorage.setItem('madinda-token', token);
    set({ user, token, loading: false });
  },

  logout: () => {
    localStorage.removeItem('madinda-token');
    set({ user: null, token: null });
  },

  login: async (email, password) => {
    set({ loading: true });
    const { data } = await authApi.login({ email, password });
    localStorage.setItem('madinda-token', data.token);
    set({ user: data.user, token: data.token, loading: false });
  },

  register: async (nom, email, password) => {
    set({ loading: true });
    const { data } = await authApi.register({ nom, email, password });
    localStorage.setItem('madinda-token', data.token);
    set({ user: data.user, token: data.token, loading: false });
  },

  initialize: async () => {
    const token = localStorage.getItem('madinda-token');
    if (!token) {
      set({ initialized: true });
      return;
    }
    try {
      const { data } = await authApi.me();
      set({ user: data.user, token, initialized: true });
    } catch {
      localStorage.removeItem('madinda-token');
      set({ user: null, token: null, initialized: true });
    }
  },
}));
