import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useAuthStore } from '../stores/useAuthStore'
import { api, type ConfirmPaymentRequest } from '../lib/api'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface PaymentFormProps {
  concertId: number
  ticketType: 'standard' | 'vip'
  quantity: number
  amount: number
  onSuccess: () => void
  onCancel: () => void
}

export default function PaymentForm({
  concertId,
  ticketType,
  quantity,
  amount,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { token } = useAuthStore()

  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !token) {
      return
    }

    setProcessing(true)
    setError(null)

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (submitError) {
      setError(submitError.message || 'Une erreur est survenue lors du paiement')
      setProcessing(false)
      return
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const confirmData: ConfirmPaymentRequest = {
          payment_intent_id: paymentIntent.id,
          concert_id: concertId,
          ticket_type: ticketType,
          quantity,
        }

        await api.post('/payment/confirm', confirmData, token)
        setSucceeded(true)
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } catch (err) {
        setError('Paiement réussi mais erreur lors de la confirmation. Contactez le support.')
      }
    }

    setProcessing(false)
  }

  if (succeeded) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Paiement Réussi !</h3>
        <p className="text-gray-400">Votre réservation a été confirmée.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">Type de billet</span>
          <span className="font-semibold text-white">{ticketType === 'vip' ? 'VIP YNOT' : 'Standard'}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">Quantité</span>
          <span className="font-semibold text-white">{quantity}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-purple-500/30">
          <span className="font-bold text-white">Total</span>
          <span className="text-2xl font-bold text-purple-400">{amount.toFixed(2)}€</span>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4">
        <PaymentElement />
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {processing ? 'Traitement...' : `Payer ${amount.toFixed(2)}€`}
        </button>
      </div>
    </form>
  )
}
