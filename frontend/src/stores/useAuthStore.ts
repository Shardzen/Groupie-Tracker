import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: number
  name: string          
  email: string
  role: string
  email_verified: boolean
  is_admin?: boolean    
}

// Define for jwtDecode result
interface DecodedToken {
  user_id: number;
  role: string;
  exp: number; 
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token, user) => {
        set({ token, user, isAuthenticated: true })
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false })
      },

      checkAuth: () => {
        const { token } = get()
        if (!token) {
          set({ isAuthenticated: false, user: null })
          return
        }

        try {
          const decoded: DecodedToken = jwtDecode(token)
          const currentTime = Date.now() / 1000
          if (decoded.exp < currentTime) {
            get().logout()
          } else {
            set({ isAuthenticated: true })
          }
        } catch (error) {
          get().logout()
        }
      },
    }),
    {
      name: 'auth-storage', 
    }
  )
)