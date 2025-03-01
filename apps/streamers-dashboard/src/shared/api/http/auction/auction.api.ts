import { HttpClientRequestOptions } from '~shared/lib/axios'

import { AUCTION_ENDPOINTS } from '~shared/constants/api/http'

import { authHttpClient } from '../auth-instance'
import { baseHttpClient } from '../base-api'

export type CreateAuctionResponse = {
  auctionId: string
  url: string
  auctionOwnerId: string
}

export const createAuction = async (
  key: string,
  fetchOptions?: HttpClientRequestOptions
) => {
  return baseHttpClient.post<CreateAuctionResponse>(AUCTION_ENDPOINTS.CREATE, {
    ...fetchOptions,
    data: { key },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getAuctionInfo = async <T>(
  auctionId: string,
  fetchOptions?: HttpClientRequestOptions
) => {
  return authHttpClient.get<T>(`/api/auction/${auctionId}/info`, {
    ...fetchOptions,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
