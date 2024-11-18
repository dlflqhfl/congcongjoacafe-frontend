import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
  selectedStoreId: string | null;
  favoriteStores: string[];
  setSelectedStore: (storeId: string) => void;
  clearSelectedStore: () => void;
  toggleFavoriteStore: (storeId: string) => void;
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set) => ({
      selectedStoreId: null,
      favoriteStores: [],
      setSelectedStore: (storeId) => set({ selectedStoreId: storeId }),
      clearSelectedStore: () => set({ selectedStoreId: null }),
      toggleFavoriteStore: (storeId) => 
        set((state) => ({
          favoriteStores: state.favoriteStores.includes(storeId)
            ? state.favoriteStores.filter(id => id !== storeId)
            : [...state.favoriteStores, storeId]
        })),
    }),
    {
      name: 'store-storage',
    }
  )
);