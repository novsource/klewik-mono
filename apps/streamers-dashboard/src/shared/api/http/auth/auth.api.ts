import { AUTH_ENDPOINTS } from '~shared/constants/api/http'

import type { HttpClientRequestOptions } from '~shared/lib/axios'

import { authHttpClient } from '../auth-instance'
import { baseHttpClient } from '../base-api'

export const loginInAuction = async (
  auctionId: string,
  password: string,
  fetchOptions?: HttpClientRequestOptions,
) => {
  return authHttpClient.post(AUTH_ENDPOINTS.LOGIN, {
    ...fetchOptions,
    data: { auctionId, password },
  })
}

export const refreshTokens = async (
  fetchOptions?: HttpClientRequestOptions,
) => {
  return baseHttpClient.post(AUTH_ENDPOINTS.REFRESH, {
    ...fetchOptions,
    withCredentials: true,
  })
}
