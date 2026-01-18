import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { mockEvents } from '../data/mockData';
import { useAuthStore } from '../stores/useAuthStore';
import { api, type CreatePaymentIntentRequest, type CreatePaymentIntentResponse } from '../lib/api';
import PaymentForm from '../components/PaymentForm';
import Navbar from '../components/Navbar';
import { Calendar, MapPin, Crown, Ticket, X, Sparkles, Star, Zap } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

type TicketType = 'standard' | 'vip';

export default function TicketsPage() {
  const { isAuthenticated, token } = useAuthStore();
  const navigate = useNavigate();

  const [selectedTickets, setSelectedTickets] = useState<Record<string, TicketType>>({});
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<{
    id: string;
    concertId: number;
    ticketType: TicketType;
    quantity: number;
  } | null>(null);

  const handleTicketSelect = (eventId: string, type: TicketType) => {
    setSelectedTickets(prev => ({
      ...prev,
      [eventId]: type
    }));
  };

  const handleOrder = async (eventId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ticketType = selectedTickets[eventId] || 'standard';
    const event = mockEvents.find(e => e.id === eventId);
    
    if (!event) return;

    const concertId = parseInt(eventId.replace('e', ''));
    
    try {
      const requestData: CreatePaymentIntentRequest = {
        concert_id: concertId,
        ticket_type: ticketType,
        quantity: 1,
      };

      const response = await api.post<CreatePaymentIntentResponse>(
        '/payment/create-intent',
        requestData,
        token || undefined
      );

      setClientSecret(response.client_secret);
      setPaymentAmount(response.amount);
      setCurrentEvent({
        id: eventId,
        concertId,
        ticketType,
        quantity: 1,
      });
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      alert('Erreur lors de la création du paiement. Veuillez réessayer.');
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setClientSecret(null);
    setCurrentEvent(null);
    alert('Réservation confirmée ! Vous allez recevoir un email de confirmation.');
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setClientSecret(null);
    setCurrentEvent(null);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob-artistic w-96 h-96 bg-violet-500 top-0 right-0 opacity-10"></div>
        <div className="blob-artistic w-96 h-96 bg-fuchsia-500 top-1/2 left-0 opacity-10 animation-delay-2000"></div>
        <div className="blob-artistic w-96 h-96 bg-orange-500 bottom-0 right-1/3 opacity-10 animation-delay-4000"></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 fade-in-artistic">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-artistic rounded-full mb-8 border border-violet-500/30">
            <Star className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="text-sm font-bold text-violet-300">Réservations Ouvertes</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-black mb-6 leading-tight">
            <span className="text-artistic-gradient">Billetterie</span>
            <br />
            <span className="text-white">Premium</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Réservez vos places pour les événements musicaux les plus exclusifs de l'année
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid gap-8 max-w-6xl mx-auto">
          {mockEvents.map((event, index) => {
            const selectedType = selectedTickets[event.id] || 'standard';
            
            return (
              <div
                key={event.id}
                className="card-artistic fade-in-artistic overflow-visible"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="grid lg:grid-cols-3 gap-0">
                  {/* Image */}
                  <div className="lg:col-span-1 relative group overflow-hidden rounded-l-artistic">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-2 p-8">
                    <div className="mb-8">
                      <h2 className="text-3xl md:text-4xl font-display font-black mb-3 text-artistic-gradient">
                        {event.name}
                      </h2>
                      <p className="text-violet-300 text-xl font-bold mb-6">{event.artistName}</p>
                      
                      <div className="flex flex-wrap gap-4 text-zinc-300">
                        <div className="flex items-center gap-2 px-4 py-2 glass-artistic rounded-xl border border-white/10">
                          <Calendar size={18} className="text-violet-400" />
                          <span className="font-semibold">
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 glass-artistic rounded-xl border border-white/10">
                          <MapPin size={18} className="text-fuchsia-400" />
                          <span className="font-semibold">{event.venue}, {event.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Options */}
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      {/* Standard Ticket */}
                      <button
                        onClick={() => handleTicketSelect(event.id, 'standard')}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                          selectedType === 'standard'
                            ? 'border-violet-500 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 shadow-glow-violet scale-105'
                            : 'border-white/20 glass-artistic hover:border-white/40 hover:scale-105'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl transition-all duration-300 ${
                              selectedType === 'standard' 
                                ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-glow-violet' 
                                : 'bg-white/10 group-hover:bg-white/20'
                            }`}>
                              <Ticket size={24} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">Standard</h3>
                              <p className="text-sm text-zinc-400">Accès Fosse</p>
                            </div>
                          </div>
                          {selectedType === 'standard' && (
                            <Sparkles className="text-violet-400 w-6 h-6 animate-pulse" />
                          )}
                        </div>
                        <ul className="text-sm text-zinc-300 space-y-2 mb-4">
                          <li className="flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-violet-400" />
                            Accès général à la fosse
                          </li>
                          <li className="flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-violet-400" />
                            Placement libre
                          </li>
                          <li className="flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-violet-400" />
                            Vue dégagée sur scène
                          </li>
                        </ul>
                        <p className="text-3xl font-bold text-violet-400">
                          {event.standardPrice.toFixed(2)}€
                        </p>
                      </button>

                      {/* VIP Ticket */}
                      <button
                        onClick={() => handleTicketSelect(event.id, 'vip')}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                          selectedType === 'vip'
                            ? 'border-fuchsia-500 bg-gradient-to-br from-fuchsia-600/20 via-orange-600/20 to-violet-600/20 shadow-artistic-multi scale-105'
                            : 'border-white/20 glass-artistic hover:border-white/40 hover:scale-105'
                        }`}
                      >
                        <div className="absolute top-3 right-3">
                          <span className="bg-gradient-to-r from-orange-400 via-fuchsia-400 to-violet-400 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-glow-orange">
                            PREMIUM
                          </span>
                        </div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl transition-all duration-300 ${
                              selectedType === 'vip' 
                                ? 'bg-gradient-to-br from-fuchsia-600 via-orange-600 to-violet-600 shadow-artistic-multi' 
                                : 'bg-white/10 group-hover:bg-white/20'
                            }`}>
                              <Crown size={24} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">VIP Exclusive</h3>
                              <p className="text-sm text-zinc-400">Expérience Ultime</p>
                            </div>
                          </div>
                          {selectedType === 'vip' && (
                            <Star className="text-orange-400 w-6 h-6 animate-pulse fill-orange-400" />
                          )}
                        </div>
                        <ul className="text-sm text-zinc-300 space-y-2 mb-4">
                          <li className="flex items-center gap-2">
                            <span className="text-lg">🏰</span>
                            Accès Loge privée
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-lg">⚡</span>
                            Coupe-file prioritaire
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-lg">🍾</span>
                            Champagne offert
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-lg">🎁</span>
                            Goodie bag exclusif
                          </li>
                        </ul>
                        <p className="text-3xl font-bold text-artistic-gradient">
                          {event.vipPrice.toFixed(2)}€
                        </p>
                      </button>
                    </div>

                    {/* Order Button */}
                    <button
                      onClick={() => handleOrder(event.id)}
                      className="btn-artistic-primary w-full group"
                    >
                      <Sparkles className="inline-block w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      <span>Commander • {selectedType === 'vip' ? event.vipPrice.toFixed(2) : event.standardPrice.toFixed(2)}€</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && clientSecret && currentEvent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 fade-in-artistic">
          <div className="glass-artistic border-2 border-white/20 rounded-3xl max-w-md w-full p-8 relative shadow-artistic-multi">
            <button
              onClick={handlePaymentCancel}
              className="absolute top-4 right-4 p-2 glass-artistic rounded-xl hover:bg-white/10 transition-all duration-300 group"
              aria-label="Fermer"
            >
              <X size={24} className="text-zinc-400 group-hover:text-white transition-colors" />
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-artistic rounded-full mb-6 border border-violet-500/30">
                <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                <span className="text-sm font-bold text-violet-300">Paiement Sécurisé</span>
              </div>
              <h2 className="text-3xl font-display font-black text-artistic-gradient mb-2">
                Finaliser le paiement
              </h2>
              <p className="text-zinc-400">Votre réservation exclusive</p>
            </div>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#7C3AED',
                    colorBackground: '#18181b',
                    colorText: '#ffffff',
                    colorDanger: '#ef4444',
                    borderRadius: '16px',
                  },
                },
              }}
            >
              <PaymentForm
                concertId={currentEvent.concertId}
                ticketType={currentEvent.ticketType}
                quantity={currentEvent.quantity}
                amount={paymentAmount}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </Elements>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t-2 border-white/5 mt-24 relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-zinc-500 text-sm">
              © 2026 Groupie Tracker. Créé avec{' '}
              <span className="text-artistic-gradient">passion</span> pour la musique.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
