import { useEffect, useState } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '@/lib/api';

// ✅ Charger Stripe UNE SEULE FOIS (pas à chaque render)
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripeKey) {
  console.error('❌ ERREUR: VITE_STRIPE_PUBLIC_KEY manquante dans .env');
}

console.log('🔑 Stripe Key configured:', stripeKey ? '✅ OK' : '❌ MANQUANTE');
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// --- COMPOSANT INTERNE : LE FORMULAIRE ---
const CheckoutForm = ({ clientSecret, totalAmount }: { clientSecret: string, totalAmount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCartStore();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage('Stripe n\'est pas encore chargé. Veuillez patienter.');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/tickets`,
          receipt_email: email,
          payment_method_data: {
            billing_details: {
              name: name,
              email: email,
            },
          },
        },
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "Une erreur est survenue avec votre carte.");
        } else {
          setMessage("Une erreur inattendue est survenue. Réessayez.");
        }
      } else {
        // Paiement réussi - Stripe redirige automatiquement
        clearCart();
      }
    } catch (err) {
      console.error('Erreur paiement:', err);
      setMessage('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
    }
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
            <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
            <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold">MC</div>
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
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Traitement sécurisé...</span>
          </>
        ) : (
          <>Payer {totalAmount.toFixed(2)} € <ArrowRight size={20}/></>
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
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirection si non authentifié
    if (!isAuthenticated) {
      console.log("❌ Utilisateur non authentifié, redirection vers /login");
      navigate('/login?redirect=/checkout');
      return;
    }

    // Redirection si panier vide
    if (items.length === 0) {
      console.log("❌ Panier vide, redirection vers /concerts");
      navigate('/concerts');
      return;
    }

    const createIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const mainItem = items[0]; 

        console.log('📤 Création Payment Intent pour concert:', mainItem.id);

        interface PaymentResponse {
          client_secret: string;
          amount: number;
        }

        const response = await api.post<PaymentResponse>("/payment/create-intent", {
          concert_id: mainItem.id, 
          ticket_type: "standard",
          quantity: mainItem.quantity,
        });
        
        console.log('✅ Payment Intent créé:', response.client_secret.substring(0, 20) + '...');
        setClientSecret(response.client_secret);
      } catch (err: any) {
        console.error("❌ Erreur backend:", err);
        setError(err.message || 'Impossible de créer le paiement. Vérifiez que votre backend fonctionne.');
      } finally {
        setIsLoading(false);
      }
    };

    createIntent();
  }, [items, isAuthenticated, navigate]);

  // Si Panier Vide (normalement on redirige, mais au cas où)
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

  // Si Stripe n'est pas configuré
  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white pt-32 flex flex-col items-center justify-center px-4">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-2">Configuration Stripe manquante</h2>
        <p className="text-zinc-400 text-center max-w-md">
          La clé publique Stripe (VITE_STRIPE_PUBLIC_KEY) n'est pas configurée. 
          Contactez l'administrateur.
        </p>
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
          
          {isLoading ? (
            <div className="bg-[#1a1a1a] h-[500px] rounded-xl border border-white/10 flex flex-col items-center justify-center text-zinc-500">
              <Loader2 className="animate-spin mb-4" size={48} />
              <p>Initialisation du paiement sécurisé...</p>
              <p className="text-xs mt-2">Cela peut prendre quelques secondes</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 p-6 rounded-xl text-red-500 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={20} />
                <span className="font-bold">Erreur</span>
              </div>
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
              >
                Réessayer
              </button>
            </div>
          ) : clientSecret ? (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm clientSecret={clientSecret} totalAmount={total()} />
            </Elements>
          ) : null}
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
                                <p className="font-bold">{(item.price * item.quantity).toFixed(2)} €</p>
                                <p className="text-xs text-zinc-500">x{item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="border-t border-white/10 pt-4 space-y-2 text-sm text-zinc-400">
                    <div className="flex justify-between">
                        <span>Sous-total</span>
                        <span>{total().toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Taxes (incluses)</span>
                        <span>0.00 €</span>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
                    <span className="font-black text-xl">TOTAL</span>
                    <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        {total().toFixed(2)} €
                    </span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
