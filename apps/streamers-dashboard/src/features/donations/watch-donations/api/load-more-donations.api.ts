import type { Auction } from '~entities/auction/model'

import { splittedDonationApi } from '~entities/donation/api'
import type {
  ProcessedDonation,
  ProcessedDonationStatus,
} from '~entities/donation/model'

import type { SortingTypes } from '~shared/store/model'

export type LoadMoreDonationsSearchParams = {
  limit: number
  after?: number
  before?: number
  order?: SortingTypes
  status?: ProcessedDonationStatus | 'all'
}

export type LoadMoreDonationsQueryArgs = LoadMoreDonationsSearchParams & {
  auctionUUID: Auction['auctionUUID']
}

type LoadMoreDonationsQueryReturnValue = ProcessedDonation[]

const loadMoreDonationApi = splittedDonationApi.injectEndpoints({
  endpoints: builder => ({
    loadMoreDonations: builder.query<
      LoadMoreDonationsQueryReturnValue,
      LoadMoreDonationsQueryArgs
    >({
      query: ({ auctionUUID, status, ...params }) => {
        if (status === 'all') {
          return {
            url: `/${auctionUUID}/donations`,
            params,
            withCredentials: true,
          }
        }

        return {
          url: `/${auctionUUID}/donations`,
          params: { status, ...params },
          withCredentials: true,
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useLazyLoadMoreDonationsQuery, useLoadMoreDonationsQuery }
  = loadMoreDonationApi
