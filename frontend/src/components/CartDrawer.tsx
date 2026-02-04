import { X, Trash2, CreditCard, Ticket } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, total } = useCartStore();
  const totalPrice = total();

  return (
    <>
      {/* Overlay sombre */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleCart}
      ></div>

      {/* Le Tiroir */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[70] transform transition-transform duration-500 shadow-[0_0_50px_rgba(139,92,246,0.1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex flex-col h-full p-6">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 uppercase tracking-tighter">
                  Votre Panier
                </h2>
                <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            {/* Liste des tickets */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center text-zinc-500 space-y-4">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-2">
                           <Ticket size={40} className="text-zinc-600" />
                        </div>
                        <p className="text-xl font-bold text-white">Votre panier est vide</p>
                        <p className="text-sm max-w-[200px]">Allez déchirer quelques tickets pour remplir cette liste !</p>
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div key={`${item.id}-${item.type}-${index}`} className="group flex gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all animate-fade-in-up">
                            {/* Image */}
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-violet-900/20 mix-blend-overlay"></div>
                            </div>
                            
                            {/* Infos */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-bold text-white leading-tight mb-1">{item.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400 uppercase tracking-wider">
                                            {item.type} Ticket
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-fuchsia-400 font-bold text-lg">{item.price} €</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-zinc-500 font-mono">x{item.quantity}</span>
                                        <button 
                                            onClick={() => removeItem(item.id, item.type)}
                                            className="text-zinc-600 hover:text-red-500 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Total & Paiement */}
            {items.length > 0 && (
                <div className="border-t border-white/10 pt-8 mt-4 bg-gradient-to-t from-[#0a0a0a] to-transparent">
                    <div className="flex justify-between items-end mb-8">
                        <span className="text-zinc-400 font-medium">Total à payer</span>
                        <div className="text-right">
                             <span className="text-4xl font-black text-white">{totalPrice} €</span>
                             <p className="text-xs text-zinc-500 mt-1">Taxes incluses</p>
                        </div>
                    </div>
                    
                    <button className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(219,39,119,0.5)] group">
                        Payer maintenant 
                        <CreditCard size={20} className="group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            )}
        </div>
      </div>
    </>
  );
}