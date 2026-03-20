import type { AuctionDTO } from './auction-api.types'

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
  fetchOptions?: HttpClientRequestOptions,
) => {
  return baseHttpClient.post<CreateAuctionResponse>(AUCTION_ENDPOINTS.CREATE, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getAuctionInfo = async (
  auctionUUID: string,
  fetchOptions?: HttpClientRequestOptions,
) => {
  const url = AUCTION_ENDPOINTS.GET_AUCTION(auctionUUID)

  return authHttpClient.get<AuctionDTO>(url, fetchOptions)
}
