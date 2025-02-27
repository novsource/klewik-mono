import { AUCTION_ENDPOINTS } from '~shared/constants/api/http'

import { HttpClientRequestOptions, baseHttpClient } from '../instance'

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
  return baseHttpClient.get<T>(`/api/auction/${auctionId}/info`, {
    ...fetchOptions,
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  })
}
