import { AUTH_ENDPOINTS } from '~shared/constants/api/http'

import type { HttpClientRequestOptions } from '~shared/lib/axios'

import { authHttpClient } from '../auth-instance'
import { baseHttpClient } from '../base-api'

export const loginInAuction = async (
  uuid: string,
  fetchOptions?: HttpClientRequestOptions,
) => {
  return authHttpClient.post<void>(AUTH_ENDPOINTS.LOGIN, {
    ...fetchOptions,
    params: {
      auction: uuid,
    },
  })
}

export const refreshTokens = async (
  fetchOptions?: HttpClientRequestOptions,
) => {
  return baseHttpClient.post<void>(AUTH_ENDPOINTS.REFRESH, {
    ...fetchOptions,
    withCredentials: true,
  })
}
