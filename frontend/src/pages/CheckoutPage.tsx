import { useEffect, useState } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '@/lib/api';

// 1. Initialiser Stripe avec ta clé publique
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// --- COMPOSANT INTERNE : LE FORMULAIRE ---
const CheckoutForm = ({ clientSecret, totalAmount }: { clientSecret: string, totalAmount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCartStore();
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/profile`,
        receipt_email: email,
        payment_method_data: {
          billing_details: {
            name: name,
            email: email,
          },
        },
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "Une erreur est survenue.");
    } else {
      setMessage("Une erreur inattendue est survenue.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
        <h3 className="text-lg font-bold mb-4 text-zinc-300">Vos Coordonnées</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1 uppercase">Nom complet</label>
            <input 
              required 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jean Dupont" 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition" 
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1 uppercase">Email</label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com" 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition" 
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 relative overflow-hidden">
        <h3 className="text-lg font-bold mb-4 text-zinc-300 flex justify-between items-center">
          <span>Paiement Sécurisé</span>
          <div className="flex gap-2">
            <div className="w-8 h-5 bg-white/10 rounded"></div>
            <div className="w-8 h-5 bg-white/10 rounded"></div>
          </div>
        </h3>
        
        <div className="min-h-[200px]">
           <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
        </div>
      </div>

      {message && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-center gap-2 text-red-500">
          <AlertCircle size={20} />
          <span className="text-sm">{message}</span>
        </div>
      )}

      <button 
        type="submit" 
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 rounded-xl font-black uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {isLoading ? (
          <span className="animate-pulse">Traitement sécurisé...</span>
        ) : (
          <>Payer {totalAmount} € <ArrowRight size={20}/></>
        )}
      </button>
      
      <p className="text-center text-xs text-zinc-500 flex items-center justify-center gap-1">
        <Lock size={10} /> Paiement chiffré SSL 256-bit par Stripe
      </p>
    </form>
  );
};

// --- COMPOSANT PRINCIPAL ---
export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const createIntent = async () => {
      try {
        const mainItem = items[0]; 

        // Interface pour typer la réponse
        interface PaymentResponse {
          client_secret: string;
          amount: number;
        }

        const response = await api.post("/payment/create-intent", {
          concert_id: mainItem.id, 
          ticket_type: "standard",
          quantity: mainItem.quantity,
        }) as PaymentResponse; 
        
        setClientSecret(response.client_secret);
      } catch (err) {
        console.error("Erreur backend:", err);
        setError(true);
      }
    };

    createIntent();
  }, [items]);

  // Si Panier Vide
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white pt-32 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
        <Link to="/concerts" className="bg-violet-600 px-6 py-2 rounded-lg font-bold hover:bg-violet-700 transition">
          Retour aux concerts
        </Link>
      </div>
    );
  }

  // Configuration Thème Stripe
  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#8b5cf6',
      colorBackground: '#1a1a1a',
      colorText: '#ffffff',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* COLONNE GAUCHE : FORMULAIRE STRIPE */}
        <div>
          <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
            <Lock className="text-violet-500" size={24} /> Paiement Sécurisé
          </h2>
          
          {clientSecret ? (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm clientSecret={clientSecret} totalAmount={total()} />
            </Elements>
          ) : error ? (
            <div className="bg-red-500/10 p-4 rounded text-red-500 border border-red-500/20">
              Impossible d'initialiser le paiement. Vérifiez que votre backend tourne.
            </div>
          ) : (
            <div className="animate-pulse bg-[#1a1a1a] h-[400px] rounded-xl border border-white/10 flex items-center justify-center text-zinc-500">
              Chargement sécurisé Stripe...
            </div>
          )}
        </div>

        {/* COLONNE DROITE : RÉSUMÉ */}
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