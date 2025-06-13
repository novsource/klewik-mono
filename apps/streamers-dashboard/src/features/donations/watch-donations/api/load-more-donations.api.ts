import { Auction } from '~entities/auction/model'

import { splittedDonationApi } from '~entities/donation/api'
import { ProcessedDonation } from '~entities/donation/model'

type LoadMoreDonationsQueryArgs = {
  auctionUUID: Auction['auctionUUID']
  page: number
  limit: number
  orderBy?: 'ascending' | 'descending'
}

type LoadMoreDonationsQueryReturnValue = ProcessedDonation[]

const loadMoreDonationApi = splittedDonationApi.injectEndpoints({
  endpoints: (builder) => ({
    loadMoreDonations: builder.query<
      LoadMoreDonationsQueryReturnValue,
      LoadMoreDonationsQueryArgs
    >({
      query: ({ auctionUUID, limit, page, orderBy }) => {
        const searchParams: Record<string, string | number> = {
          limit,
          page,
          orderBy: orderBy ?? 'ascending',
        }

        return {
          url: `/auction/${auctionUUID}/donations`,
          params: searchParams,
          withCredentials: true,
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useLazyLoadMoreDonationsQuery, useLoadMoreDonationsQuery } =
  loadMoreDonationApi
