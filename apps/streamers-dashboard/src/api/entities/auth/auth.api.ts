import { HttpClientRequestOptions, baseHttpClient } from '@api/instance'

export const loginInAuction = async (
  auctionId: string,
  password: string,
  fetchOptions?: HttpClientRequestOptions
) => {
  return baseHttpClient.post('/api/auth/login', {
    ...fetchOptions,
    withCredentials: true,
    data: { auctionId, password },
  })
}

export const refreshTokens = async (
  fetchOptions?: HttpClientRequestOptions
) => {
  return baseHttpClient.get('/api/auth/refresh', {
    ...fetchOptions,
    withCredentials: true,
  })
}
