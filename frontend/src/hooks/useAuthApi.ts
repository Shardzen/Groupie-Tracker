import { api } from '@/lib/api';

/**
 * Hook simplifié pour utiliser l'API avec authentification automatique.
 * Le token JWT est automatiquement récupéré depuis le store Zustand.
 * 
 * @deprecated Ce hook n'est plus nécessaire car api.ts gère automatiquement le token.
 * Utilisez directement `import { api } from '@/lib/api'` à la place.
 */
export const useAuthApi = () => {
  // Plus besoin de récupérer le token manuellement
  // car api.ts le fait automatiquement via useAuthStore.getState().token
  return api;
};
