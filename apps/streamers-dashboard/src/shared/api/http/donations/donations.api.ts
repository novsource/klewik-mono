import type { ProcessedDonationDTOStatus } from './donations-api.types'

import type { HttpClientRequestOptions } from '~shared/lib/axios'

import { authHttpClient } from '../auth-instance'

type GetDonationsStatsResponseData = Record<ProcessedDonationDTOStatus, number>

export const getDonationsStats = async (auctionUUID: string, options?: HttpClientRequestOptions) => {
  return authHttpClient.get<GetDonationsStatsResponseData>(`/api/v1/auctions/${auctionUUID}/donations/stats`, options)
}
