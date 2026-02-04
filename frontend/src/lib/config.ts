// Configuration de l'API backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper pour construire des URLs d'API
export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;
