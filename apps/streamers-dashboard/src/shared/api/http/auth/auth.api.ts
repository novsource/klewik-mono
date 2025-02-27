import { HttpClientRequestOptions } from '~shared/lib/axios'

import { AUTH_ENDPOINTS } from '~shared/constants/api/http'

import { baseHttpClient } from '../base-api'

export const loginInAuction = async (
  auctionId: string,
  password: string,
  fetchOptions?: HttpClientRequestOptions
) => {
  return baseHttpClient.post(AUTH_ENDPOINTS.LOGIN, {
    ...fetchOptions,
    withCredentials: true,
    data: { auctionId, password },
  })
}

export const refreshTokens = async (
  fetchOptions?: HttpClientRequestOptions
) => {
  return baseHttpClient.post(AUTH_ENDPOINTS.REFRESH, {
    ...fetchOptions,
    withCredentials: true,
  })
}
