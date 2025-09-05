import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'
import type { AuctionSlot } from '~entities/auction-slot/model'

import type { SortingTypes } from '~shared/store/model'

export type LoadMoreSlotsQueryArgs = {
  auctionUUID: string
  limit?: number
  order?: SortingTypes
  after?: number
  before?: number
}

const loadMoreSlotsApi = splittedAuctionSlotsApi.injectEndpoints(
  { endpoints: builder => ({
    loadMoreSlots: builder.query<AuctionSlot[], LoadMoreSlotsQueryArgs>((
      {
        query: ({
          auctionUUID,
          ...params
        }) => ({
          url: `/${auctionUUID}/slots`,
          params,
          withCredentials: true,
        }),
      }
    )),
  }) },
)

export const { useLazyLoadMoreSlotsQuery, useLoadMoreSlotsQuery } = loadMoreSlotsApi
