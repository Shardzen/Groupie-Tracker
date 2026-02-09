import { useState } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { CreditCard, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      clearCart(); 
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 2000);
  };

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white pt-32 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
        <Link to="/concerts" className="bg-violet-600 px-6 py-2 rounded-lg font-bold hover:bg-violet-700 transition">
          Retour aux concerts
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col items-center justify-center p-4 text-center">
        <CheckCircle size={80} className="text-green-500 mb-6 animate-bounce" />
        <h1 className="text-4xl font-black mb-2 uppercase">Paiement Réussi !</h1>
        <p className="text-zinc-400 max-w-md">
          Merci pour votre commande. Vos billets ont été envoyés par email.
          Vous allez être redirigé vers l'accueil...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        <div>
          <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
            <Lock className="text-violet-500" size={24} /> Paiement Sécurisé
          </h2>
          
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 text-zinc-300">Vos Coordonnées</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-xs text-zinc-500 mb-1 uppercase">Email</label>
                    <input required type="email" placeholder="votre@email.com" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition" />
                </div>
                <div>
                    <label className="block text-xs text-zinc-500 mb-1 uppercase">Prénom</label>
                    <input required type="text" placeholder="Jean" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition" />
                </div>
                <div>
                    <label className="block text-xs text-zinc-500 mb-1 uppercase">Nom</label>
                    <input required type="text" placeholder="Dupont" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition" />
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 relative overflow-hidden">
              <h3 className="text-lg font-bold mb-4 text-zinc-300 flex justify-between">
                <span>Carte Bancaire</span>
                <div className="flex gap-2">
                  <div className="w-8 h-5 bg-white/10 rounded"></div>
                  <div className="w-8 h-5 bg-white/10 rounded"></div>
                </div>
              </h3>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs text-zinc-500 mb-1 uppercase">Numéro de carte</label>
                    <div className="relative">
                        <CreditCard className="absolute left-3 top-3.5 text-zinc-500" size={18}/>
                        <input required type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-zinc-500 mb-1 uppercase">Expiration</label>
                        <input required type="text" placeholder="MM / AA" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-xs text-zinc-500 mb-1 uppercase">CVC</label>
                        <input required type="text" placeholder="123" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition" />
                    </div>
                 </div>
              </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 rounded-xl font-black uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {loading ? (
                    <span className="animate-pulse">Traitement en cours...</span>
                ) : (
                    <>Payer {total()} € <ArrowRight size={20}/></>
                )}
            </button>
            <p className="text-center text-xs text-zinc-500 flex items-center justify-center gap-1">
                <Lock size={10} /> Paiement chiffré SSL 256-bit
            </p>
          </form>
        </div>

        <div className="lg:pl-12">
            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 sticky top-24">
                <h3 className="font-bold text-xl mb-6">Résumé de la commande</h3>
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                            <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-zinc-800" />
                            <div className="flex-1">
                                <h4 className="font-bold text-sm">{item.title}</h4>
                                <p className="text-xs text-zinc-400">Standard Ticket</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{item.price * item.quantity} €</p>
                                <p className="text-xs text-zinc-500">x{item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="border-t border-white/10 pt-4 space-y-2 text-sm text-zinc-400">
                    <div className="flex justify-between">
                        <span>Sous-total</span>
    
                        <span>{total()} €</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Taxes (incluses)</span>
                        <span>0.00 €</span>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
                    <span className="font-black text-xl">TOTAL</span>
                    <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        {total()} €
                    </span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}