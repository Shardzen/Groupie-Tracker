export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const ENDPOINTS = {
  ARTISTS: '/artists',
  LOCATIONS: '/locations',
  CONCERTS: '/concerts',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  FAVORITES: '/favorites',
} as const;
