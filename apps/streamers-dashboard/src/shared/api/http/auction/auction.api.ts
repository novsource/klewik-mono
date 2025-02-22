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
