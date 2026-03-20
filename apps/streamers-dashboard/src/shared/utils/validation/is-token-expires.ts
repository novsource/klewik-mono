import { AUTH_TOKENS_LIFE_TIME_MS } from '~shared/constants/auth'

export const isTokenExpires = (type: Lowercase<keyof typeof AUTH_TOKENS_LIFE_TIME_MS>, time: number) => {
  const token = type.toUpperCase() as keyof typeof AUTH_TOKENS_LIFE_TIME_MS

  return Date.now() - time >= AUTH_TOKENS_LIFE_TIME_MS[token]
}
