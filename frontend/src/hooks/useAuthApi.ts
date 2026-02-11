import { useMemo } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/lib/api';

/**
 * A custom hook to provide an API client that automatically includes the JWT token
 * from the authentication store for authenticated requests.
 * Use this hook in components that need to make API calls to protected endpoints.
 */
export const useAuthApi = () => {
  const token = useAuthStore((state) => state.token);

  // Memoize the api object to avoid unnecessary re-creations
  const authApi = useMemo(() => {
    // Create a new object with methods that always pass the token
    return {
      get: <T>(endpoint: string) => api.get<T>(endpoint, token || undefined),
      post: <T>(endpoint: string, data?: unknown) => api.post<T>(endpoint, data, token || undefined),
      put: <T>(endpoint: string, data?: unknown) => api.put<T>(endpoint, data, token || undefined),
      delete: <T>(endpoint: string) => api.delete<T>(endpoint, token || undefined),
    };
  }, [token]); // Re-create authApi only if the token changes

  return authApi;
};