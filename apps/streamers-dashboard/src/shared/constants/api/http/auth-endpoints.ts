export const AUTH_ENDPOINTS = {
  LOGIN: `${import.meta.env.VITE_SERVER_API_PREFIX}/auth/login`,
  REFRESH: `${import.meta.env.VITE_SERVER_API_PREFIX}/auth/refresh`,
} as const
