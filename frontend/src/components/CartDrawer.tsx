import { X, Trash2, CreditCard, Ticket } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, total } = useCartStore();
  const totalPrice = total();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleCart}
      ></div>

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[70] transform transition-transform duration-500 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex flex-col h-full p-6">
            
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                  Votre Panier
                </h2>
                <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center text-zinc-500 space-y-4">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-2">
                           <Ticket size={40} className="text-zinc-600" />
                        </div>
                        <p className="text-xl font-bold text-white">Votre panier est vide</p>
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div key={`${item.id}-${item.type}-${index}`} className="group flex gap-4 bg-zinc-900 p-4 rounded-2xl border border-white/5 transition-all animate-fade-in-up">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-bold text-white leading-tight mb-1">{item.title}</h3>
                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-zinc-400 uppercase tracking-wider">
                                        {item.type} Ticket
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-white font-bold text-lg">{item.price} €</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-zinc-500 font-mono">x{item.quantity}</span>
                                        <button 
                                            onClick={() => removeItem(item.id, item.type)}
                                            className="text-zinc-600 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
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

            {items.length > 0 && (
                <div className="border-t border-white/10 pt-8 mt-4 bg-[#0a0a0a]">
                    <div className="flex justify-between items-end mb-8">
                        <span className="text-zinc-400 font-medium">Total à payer</span>
                        <div className="text-right">
                             <span className="text-4xl font-black text-white">{totalPrice} €</span>
                             <p className="text-xs text-zinc-500 mt-1">Taxes incluses</p>
                        </div>
                    </div>
            
                    <Link 
                        to="/checkout"
                        onClick={toggleCart}
                        className="w-full py-4 bg-violet-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-violet-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg group"
                    >
                        Payer maintenant 
                        <CreditCard size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            )}
        </div>
      </div>
    </>
  );
}