import { create } from 'zustand';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nom: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => Promise<void>;
  updateProfile: (data: Partial<{ nom: string; email: string; avatar: string; phone: string }>) => Promise<void>;
  setUser: (user: User) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('madinda-token'),
  loading: !!localStorage.getItem('madinda-token'),

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('madinda-token', data.token);
      set({ user: data.user, token: data.token, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (nom, email, password) => {
    set({ loading: true });
    try {
      const { data } = await authApi.register({ nom, email, password });
      localStorage.setItem('madinda-token', data.token);
      set({ user: data.user, token: data.token, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('madinda-token');
    set({ user: null, token: null });
  },

  loadFromStorage: async () => {
    const token = localStorage.getItem('madinda-token');
    if (!token) {
      set({ loading: false });
      return;
    }
    set({ loading: true });
    try {
      const { data } = await authApi.getProfile();
      set({ user: data.user || data, token, loading: false });
    } catch {
      localStorage.removeItem('madinda-token');
      set({ user: null, token: null, loading: false });
    }
  },

  updateProfile: async (profileData) => {
    const { data } = await authApi.updateProfile(profileData);
    set({ user: data.user || data });
  },

  setUser: (user) => set({ user }),
}));

export { useAuthStore };
export default useAuthStore;
