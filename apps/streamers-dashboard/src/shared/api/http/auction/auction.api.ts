import { AUCTION_ENDPOINTS } from '~shared/constants/api/http'

import type { HttpClientRequestOptions } from '~shared/lib/axios'

import { authHttpClient } from '../auth-instance'
import { baseHttpClient } from '../base-api'

export type CreateAuctionResponse = {
  auctionId: string
  url: string
  auctionOwnerId: string
}

export const createAuction = async (
  key: string,
  fetchOptions?: HttpClientRequestOptions,
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
  auctionUUID: string,
  fetchOptions?: HttpClientRequestOptions,
) => {
  return authHttpClient.get<T>(`/api/v1/auctions/${auctionUUID}`, {
    ...fetchOptions,
  })
}
