import type { AuctionSlotsDTO } from './auction-slots-api.types'

import { AUCTION_SLOTS_ENDPOINTS } from '~shared/constants/api/http'

import type { HttpClientRequestOptions } from '~shared/lib/axios'

import { authHttpClient } from '../auth-instance'

type GetAuctionSlotsResponse = AuctionSlotsDTO[]

export const getAuctionSlots = async (
  auctionUUID: string,
  fetchOptions?: HttpClientRequestOptions,
) => {
  const url = AUCTION_SLOTS_ENDPOINTS.GET_SLOTS_BY_UUID(auctionUUID)

  return authHttpClient.get<GetAuctionSlotsResponse>(url, fetchOptions)
}
