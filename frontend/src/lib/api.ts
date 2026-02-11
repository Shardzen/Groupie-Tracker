import { useAuthStore } from '../stores/useAuthStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

interface FetchOptions extends RequestInit {
  // token?: string // Removed token parameter
}

class APIError extends Error {
  status: number
  
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'APIError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { /* token, */ ...fetchOptions } = options // Removed token destructuring
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  const token = useAuthStore.getState().token // Get token from Zustand store
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new APIError(
        errorData.error || errorData.message || `HTTP ${response.status}`,
        response.status
      )
    }

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof APIError) {
      throw error
    }
    
    if ((error as Error).name === 'AbortError') {
      throw new APIError('Request timeout', 408)
    }
    
    throw new APIError('Network error', 0)
  }
}

export const api = {
  get: <T>(endpoint: string /* , token?: string */) => // Removed token parameter
    apiRequest<T>(endpoint, { method: 'GET' /* , token */ }), // Removed token parameter
    
  post: <T>(endpoint: string, data?: unknown /* , token?: string */) => // Removed token parameter
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      // token, // Removed token parameter
    }),
    
  put: <T>(endpoint: string, data?: unknown /* , token?: string */) => // Removed token parameter
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      // token, // Removed token parameter
    }),
    
  delete: <T>(endpoint: string /* , token?: string */) => // Removed token parameter
    apiRequest<T>(endpoint, { method: 'DELETE' /* , token */ }), // Removed token parameter
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string // ✅ Changé
  last_name: string  // ✅ Changé
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    first_name: string // ✅ Changé
    last_name: string  // ✅ Changé
    role: string
    email_verified: boolean // ✅ Ajouté pour ton vérificateur
  }
}

export interface CreatePaymentIntentRequest {
  concert_id: number
  ticket_type: 'standard' | 'vip'
  quantity: number
}

export interface CreatePaymentIntentResponse {
  client_secret: string
  amount: number
}

export interface ConfirmPaymentRequest {
  payment_intent_id: string
  concert_id: number
  ticket_type: string
  quantity: number
}

export { APIError }
