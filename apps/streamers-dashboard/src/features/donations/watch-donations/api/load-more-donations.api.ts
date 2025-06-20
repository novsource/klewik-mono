import { Auction } from '~entities/auction/model'

import { splittedDonationApi } from '~entities/donation/api'
import { ProcessedDonation } from '~entities/donation/model'

type LoadMoreDonationsQueryArgs = {
  auctionUUID: Auction['auctionUUID']
  limit: number
  after?: number
  before?: number
  order?: 'asc' | 'desc'
}

type LoadMoreDonationsQueryReturnValue = ProcessedDonation[]

const loadMoreDonationApi = splittedDonationApi.injectEndpoints({
  endpoints: (builder) => ({
    loadMoreDonations: builder.query<
      LoadMoreDonationsQueryReturnValue,
      LoadMoreDonationsQueryArgs
    >({
      query: ({ auctionUUID, limit, after, before, order }) => {
        const searchParams: Omit<LoadMoreDonationsQueryArgs, 'auctionUUID'> = {
          order: order ?? 'asc',
          limit,
        }

        if (Number.isInteger(before)) searchParams['before'] = before
        if (Number.isInteger(after)) searchParams['after'] = after

        return {
          url: `/${auctionUUID}/donations`,
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
