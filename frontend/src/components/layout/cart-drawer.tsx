import { X, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { useCartStore } from "../../stores/useCartStore";
import { toast } from "sonner"; // Pour afficher la notif

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, total, clearCart } = useCartStore();

  const handleCheckout = () => {
    toast.success("Paiement simulé avec succès ! 🎟️");
    clearCart();
    toggleCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. L'ombre noire derrière (Overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* 2. Le Volet qui glisse */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header du Panier */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="text-primary" /> Mon Panier
                <span className="text-sm font-normal text-gray-500 ml-2">({items.length} articles)</span>
              </h2>
              <button onClick={toggleCart} className="text-gray-400 hover:text-white p-2">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Liste des articles */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                    <ShoppingBag className="h-16 w-16 opacity-20" />
                    <p>Votre panier est vide.</p>
                    <Button variant="outline" onClick={toggleCart}>Explorer les concerts</Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                    <img src={item.image} alt={item.title} className="h-20 w-20 rounded-lg object-cover bg-gray-800" />
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h4 className="font-bold text-white line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-primary font-bold">{item.price} €</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Qté: {item.quantity}</span>
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer avec Total et Paiement */}
            {items.length > 0 && (
                <div className="p-6 bg-white/5 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-center text-lg font-bold text-white">
                        <span>Total</span>
                        <span>{total()} €</span>
                    </div>
                    <Button onClick={handleCheckout} className="w-full h-12 text-lg font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                        <CreditCard className="mr-2 h-5 w-5" /> Payer maintenant
                    </Button>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}