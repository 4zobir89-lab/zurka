import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const cleanPrice = Number(String(item.price).replace(/[^0-9.]/g, '')) || 0;
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return { items: state.items.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i) };
          }
          return { items: [...state.items, { ...item, price: cleanPrice }] };
        });
      },
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.productId !== id) })),
      updateQuantity: (id, qty) => set((state) => ({ items: state.items.map((i) => i.productId === id ? { ...i, quantity: Math.max(1, qty) } : i) })),
      clearCart: () => set({ items: [] }),
      totalAmount: () => get().items.reduce((sum, i) => sum + (i.price * i.quantity), 0),
    }),
    { name: 'zurka-master-cart-v3' }
  )
);
