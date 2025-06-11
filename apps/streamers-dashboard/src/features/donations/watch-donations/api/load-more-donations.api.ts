import { Auction } from '~entities/auction/model'

import { splittedDonationApi } from '~entities/donation/api'
import { ProcessedDonation } from '~entities/donation/model'

type LoadMoreDonationsQueryArgs = {
  auctionUUID: Auction['auctionUUID']
  fromId?: number
  count?: number
}

type LoadMoreDonationsQueryReturnValue = {
  data: ProcessedDonation[]
}

const loadMoreDonationApi = splittedDonationApi.injectEndpoints({
  endpoints: (builder) => ({
    loadMoreDonations: builder.query<
      LoadMoreDonationsQueryReturnValue,
      LoadMoreDonationsQueryArgs
    >({
      query: ({ auctionUUID, count, fromId }) => {
        const searchParams: Record<string, string | number> = {
          limit: count ?? 15,
        }

        if (fromId) searchParams['fromId'] = fromId

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
