import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OwnerStore {
  id: number | null;
  sName: string | null;
  isFirstLogin: boolean;
  setStore: (storeId: number, storeName: string) => void;
  setFirstLogin: (isFirst: boolean) => void;
  clearStore: () => void;
}

export const useOwnerStore = create<OwnerStore>()(
  persist(
    (set) => ({
      id: null,
      sName: null,
      isFirstLogin: false,
      setStore: (id, sName) => set({ id, sName }),
      setFirstLogin: (isFirst) => set({ isFirstLogin: isFirst }),
      clearStore: () => set({ id: null, sName: null, isFirstLogin: false }),
    }),
    {
      name: 'owner-storage',
    }
  )
);