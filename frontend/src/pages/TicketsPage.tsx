import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { mockEvents } from '../data/mockData'
import { useAuthStore } from '../stores/useAuthStore'
import { api, type CreatePaymentIntentRequest, type CreatePaymentIntentResponse } from '../lib/api'
import PaymentForm from '../components/PaymentForm'
import { Calendar, MapPin, Crown, Ticket, X } from 'lucide-react'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '')

type TicketType = 'standard' | 'vip'

export default function TicketsPage() {
  const { isAuthenticated, token } = useAuthStore()
  const navigate = useNavigate()

  const [selectedTickets, setSelectedTickets] = useState<Record<string, TicketType>>({})
  const [showPayment, setShowPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [currentEvent, setCurrentEvent] = useState<{
    id: string
    concertId: number
    ticketType: TicketType
    quantity: number
  } | null>(null)

  const handleTicketSelect = (eventId: string, type: TicketType) => {
    setSelectedTickets(prev => ({
      ...prev,
      [eventId]: type
    }))
  }

  const handleOrder = async (eventId: string) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const ticketType = selectedTickets[eventId] || 'standard'
    const event = mockEvents.find(e => e.id === eventId)
    
    if (!event) return

    const concertId = parseInt(eventId.replace('e', ''))
    
    try {
      const requestData: CreatePaymentIntentRequest = {
        concert_id: concertId,
        ticket_type: ticketType,
        quantity: 1,
      }

      const response = await api.post<CreatePaymentIntentResponse>(
        '/payment/create-intent',
        requestData,
        token || undefined
      )

      setClientSecret(response.client_secret)
      setPaymentAmount(response.amount)
      setCurrentEvent({
        id: eventId,
        concertId,
        ticketType,
        quantity: 1,
      })
      setShowPayment(true)
    } catch (error) {
      console.error('Error creating payment intent:', error)
      alert('Erreur lors de la création du paiement. Veuillez réessayer.')
    }
  }

  const handlePaymentSuccess = () => {
    setShowPayment(false)
    setClientSecret(null)
    setCurrentEvent(null)
    alert('Réservation confirmée ! Vous allez recevoir un email de confirmation.')
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setClientSecret(null)
    setCurrentEvent(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Billetterie
          </h1>
          <p className="text-xl text-gray-300">
            Réservez vos places pour les plus grands événements musicaux
          </p>
        </div>

        <div className="grid gap-8">
          {mockEvents.map((event) => {
            const selectedType = selectedTickets[event.id] || 'standard'
            
            return (
              <div
                key={event.id}
                className="bg-white/5 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <div className="grid lg:grid-cols-3 gap-0">
                  <div className="lg:col-span-1">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="lg:col-span-2 p-8">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold mb-2">{event.name}</h2>
                      <p className="text-purple-300 text-lg mb-4">{event.artistName}</p>
                      
                      <div className="flex flex-wrap gap-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-purple-400" />
                          {new Date(event.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={18} className="text-pink-400" />
                          {event.venue}, {event.city}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <button
                        onClick={() => handleTicketSelect(event.id, 'standard')}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${
                          selectedType === 'standard'
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${selectedType === 'standard' ? 'bg-purple-500' : 'bg-white/10'}`}>
                              <Ticket size={24} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">Standard</h3>
                              <p className="text-sm text-gray-400">Accès Fosse</p>
                            </div>
                          </div>
                          {selectedType === 'standard' && (
                            <span className="text-2xl">✓</span>
                          )}
                        </div>
                        <ul className="text-sm text-gray-300 space-y-1 mb-4">
                          <li>• Accès général à la fosse</li>
                          <li>• Placement libre</li>
                          <li>• Vue dégagée sur scène</li>
                        </ul>
                        <p className="text-3xl font-bold text-purple-400">
                          {event.standardPrice.toFixed(2)}€
                        </p>
                      </button>

                      <button
                        onClick={() => handleTicketSelect(event.id, 'vip')}
                        className={`p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
                          selectedType === 'vip'
                            ? 'border-pink-500 bg-gradient-to-br from-pink-500/20 to-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:border-white/40'
                        }`}
                      >
                        <div className="absolute top-2 right-2">
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                            PREMIUM
                          </span>
                        </div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${selectedType === 'vip' ? 'bg-gradient-to-br from-pink-500 to-purple-500' : 'bg-white/10'}`}>
                              <Crown size={24} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">VIP YNOT</h3>
                              <p className="text-sm text-gray-400">Expérience Premium</p>
                            </div>
                          </div>
                          {selectedType === 'vip' && (
                            <span className="text-2xl">✓</span>
                          )}
                        </div>
                        <ul className="text-sm text-gray-300 space-y-1 mb-4">
                          <li>• 🏰 Accès Loge privée</li>
                          <li>• ⚡ Coupe-file prioritaire</li>
                          <li>• 🍾 Champagne offert</li>
                          <li>• 🎁 Goodie bag exclusif</li>
                        </ul>
                        <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                          {event.vipPrice.toFixed(2)}€
                        </p>
                      </button>
                    </div>

                    <button
                      onClick={() => handleOrder(event.id)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-xl"
                    >
                      Commander • {selectedType === 'vip' ? event.vipPrice.toFixed(2) : event.standardPrice.toFixed(2)}€
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showPayment && clientSecret && currentEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-black border border-purple-500/50 rounded-3xl max-w-md w-full p-8 relative">
            <button
              onClick={handlePaymentCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6">Finaliser le paiement</h2>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#a855f7',
                    colorBackground: '#1e293b',
                    colorText: '#ffffff',
                    colorDanger: '#ef4444',
                    borderRadius: '12px',
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
    </div>
  )
}
