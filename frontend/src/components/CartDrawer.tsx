import { X, Trash2, ShoppingBag, CreditCard, Ticket } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, total } = useCartStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Fond sombre (cliquer dessus ferme le panier) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={toggleCart}
      />

      {/* Le Panier qui glisse */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-violet-500" /> Mon Panier
            <span className="text-sm font-normal text-zinc-400 ml-2">({items.length})</span>
          </h2>
          <button onClick={toggleCart} className="text-zinc-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Liste des articles */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-zinc-500">
              <ShoppingBag size={64} className="opacity-20" />
              <p>Votre panier est vide.</p>
              <button 
                onClick={toggleCart} 
                className="text-violet-400 hover:text-violet-300 font-bold text-sm"
              >
                Retourner aux concerts
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.type}`} className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-violet-500/30 transition-colors">
                <img src={item.image} alt={item.title} className="h-20 w-20 rounded-xl object-cover" />
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white line-clamp-1">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.type === 'vip' ? 'bg-gradient-to-r from-orange-500 to-fuchsia-500 text-black' : 'bg-white/10 text-zinc-300'}`}>
                            {item.type.toUpperCase()}
                        </span>
                        <span className="text-violet-400 font-bold">{item.price} €</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-zinc-400">Qté: {item.quantity}</span>
                    <button 
                      onClick={() => removeItem(item.id, item.type)}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer (Total + Checkout) */}
        {items.length > 0 && (
          <div className="p-6 bg-[#0f0f0f] border-t border-white/10 space-y-4 pb-safe">
            <div className="flex justify-between items-center text-lg font-bold text-white">
              <span>Total</span>
              <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                {total().toFixed(2)} €
              </span>
            </div>
            
            <button 
                onClick={() => {
                    toggleCart();
                    navigate('/tickets'); // Ou vers une page de paiement spécifique
                }}
                className="w-full py-4 bg-white text-black font-black text-lg rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <CreditCard size={20} /> Paiement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}