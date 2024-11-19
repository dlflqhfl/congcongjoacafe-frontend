import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  verificationEmail: string | null;
  login: (user: User) => void;
  logout: () => void;
  setVerificationEmail: (email: string | null) => void;
  updateUser: (updates: Partial<User>) => void;
}

const defaultUser: User = {
  id: '',
  email: '',
  name: '',
  phone: '',
  role: 'CUSTOMER',
  point: 0,
  level: 'Green',
  createdAt: new Date().toISOString(),
  verified: false
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      verificationEmail: null,
      login: (user) => set({ user: { ...defaultUser, ...user }, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setVerificationEmail: (email) => set({ verificationEmail: email }),
      updateUser: (updates) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);