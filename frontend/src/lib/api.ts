const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

interface FetchOptions extends RequestInit {
  token?: string
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
  const { token, ...fetchOptions } = options
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
  get: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, { method: 'GET', token }),
    
  post: <T>(endpoint: string, data?: unknown, token?: string) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
    
  put: <T>(endpoint: string, data?: unknown, token?: string) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),
    
  delete: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE', token }),
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
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
    name: string
    role: string
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
