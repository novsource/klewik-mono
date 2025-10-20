import type { AuctionSlotsDTO } from './auction-slots-api.types'

import type { HttpClientRequestOptions } from '~shared/lib/axios'

import { authHttpClient } from '../auth-instance'

type GetAuctionSlotsResponse = AuctionSlotsDTO[]

export const getAuctionSlots = async (
  auctionUUID: string,
  fetchOptions?: HttpClientRequestOptions,
) => {
  return authHttpClient.get<GetAuctionSlotsResponse>(`/api/v1/auctions/${auctionUUID}/slots`, fetchOptions)
}
