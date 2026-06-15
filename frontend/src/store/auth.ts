import { create } from 'zustand';
import { User } from '../types';
import api from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const storedToken = localStorage.getItem('sna_token');
const storedUser = localStorage.getItem('sna_user');

export const useAuthStore = create<AuthState>((set) => ({
  user: storedToken && storedUser ? JSON.parse(storedUser) as User : null,
  token: storedToken,

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('sna_token', token);
    localStorage.setItem('sna_user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('sna_token');
    localStorage.removeItem('sna_user');
    set({ user: null, token: null });
  },
}));
