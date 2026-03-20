import type { DonationCodeDTO, ProcessedDonationDTOStatus } from './donations-api.types'

import type { HttpClientRequestOptions } from '~shared/lib/axios'

import { authHttpClient } from '../auth-instance'

type GetDonationsStatsResponseData = Record<ProcessedDonationDTOStatus, number>

export const getDonationsStats = async (auctionUUID: string, options?: HttpClientRequestOptions) => {
  return authHttpClient.get<GetDonationsStatsResponseData>(`${import.meta.env.VITE_SERVER_API_PREFIX}}/auctions/${auctionUUID}/donations/stats`, options)
}

type GetDonationCodeInfoQueryParams = {
  auctionUUID: string
  code: string
}

export const getDonationCodeInfo = async (data: GetDonationCodeInfoQueryParams, options?: HttpClientRequestOptions) => {
  const { auctionUUID, code } = data

  return authHttpClient.get<DonationCodeDTO>(`${import.meta.env.VITE_SERVER_API_PREFIX}/auctions/${auctionUUID}/donations/code/info?code=${code}`, options)
}
