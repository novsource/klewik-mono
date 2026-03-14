export const AUTH_TOKENS_LIFE_TIME_MS = {
  ACCESS: 100 * 60 * 15, // 15 minutes
  REFRESH: 100 * 60 * 60 * 24, // 1 day (24 hours)
} as const
