import { create } from 'zustand'

export type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean; // Est-ce que le volet du panier est ouvert ?
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  toggleCart: () => void; // Ouvrir/Fermer le panier
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (newItem) => set((state) => {
    // On vérifie si l'article est déjà dans le panier
    const existingItem = state.items.find((item) => item.id === newItem.id);
    
    if (existingItem) {
      // S'il existe, on augmente juste la quantité
      return {
        items: state.items.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
        isOpen: true // On ouvre le panier automatiquement pour montrer l'ajout
      };
    }
    
    // Sinon, on l'ajoute
    return { 
      items: [...state.items, { ...newItem, quantity: 1 }],
      isOpen: true 
    };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),

  clearCart: () => set({ items: [] }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  // Calcul du prix total
  total: () => {
    const items = get().items;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}))