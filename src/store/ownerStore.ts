import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OwnerStore {
  storeId: string | null;
  storeName: string | null;
  isFirstLogin: boolean;
  setStore: (storeId: string, storeName: string) => void;
  setFirstLogin: (isFirst: boolean) => void;
  clearStore: () => void;
}

export const useOwnerStore = create<OwnerStore>()(
  persist(
    (set) => ({
      storeId: null,
      storeName: null,
      isFirstLogin: false,
      setStore: (storeId, storeName) => set({ storeId, storeName }),
      setFirstLogin: (isFirst) => set({ isFirstLogin: isFirst }),
      clearStore: () => set({ storeId: null, storeName: null, isFirstLogin: false }),
    }),
    {
      name: 'owner-storage',
    }
  )
);