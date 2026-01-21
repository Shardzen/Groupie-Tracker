import { create } from 'zustand';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  type: 'standard' | 'vip';
};

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  addItem: (item: CartItem) => void;
  removeItem: (id: string, type: 'standard' | 'vip') => void;
  clearCart: () => void;
  toggleCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (newItem) => set((state) => {
    // Vérifie si l'article existe déjà (même ID ET même type de billet)
    const existingItem = state.items.find(
      (i) => i.id === newItem.id && i.type === newItem.type
    );

    let updatedItems;
    if (existingItem) {
      updatedItems = state.items.map((i) =>
        i.id === newItem.id && i.type === newItem.type
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      updatedItems = [...state.items, { ...newItem, quantity: 1 }];
    }

    return { items: updatedItems, isOpen: true }; // On ouvre le panier quand on ajoute !
  }),

  removeItem: (id, type) => set((state) => ({
    items: state.items.filter((i) => !(i.id === id && i.type === type))
  })),

  clearCart: () => set({ items: [] }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  total: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));