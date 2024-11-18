import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  selectedStoreId: string | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  setSelectedStore: (storeId: string) => void;
  clearSelectedStore: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      selectedStoreId: null,
      
      addToCart: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id &&
                    item.size === newItem.size &&
                    item.temperature === newItem.temperature &&
                    JSON.stringify(item.extras) === JSON.stringify(newItem.extras)
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += newItem.quantity;
            newItems[existingItemIndex].totalPrice += newItem.totalPrice;
            return { items: newItems };
          }

          return { items: [...state.items, newItem] };
        });
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId)
        }));
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === itemId) {
              const unitPrice = item.totalPrice / item.quantity;
              return {
                ...item,
                quantity,
                totalPrice: unitPrice * quantity
              };
            }
            return item;
          })
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      setSelectedStore: (storeId) => set({ selectedStoreId: storeId }),
      
      clearSelectedStore: () => set({ selectedStoreId: null }),
    }),
    {
      name: 'cart-storage',
    }
  )
);