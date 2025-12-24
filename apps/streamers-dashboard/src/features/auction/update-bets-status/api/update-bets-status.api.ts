import { splittedAuctionApi } from '~entities/auction/api'
import type { Auction } from '~entities/auction/model'
import { auctionActions } from '~entities/auction/store'

type UpdateBetsStatusQueryArgs = {
  auctionUUID: Auction['auctionUUID']
  status: Auction['isBetsClosed']
}

const updateBetsStatusApi = splittedAuctionApi.injectEndpoints({
  endpoints: builder => ({
    updateBetsStatus: builder.query<void, UpdateBetsStatusQueryArgs>({
      query: ({ auctionUUID, status }) => ({ url: `/${auctionUUID}/close-bets`, data: status, withCredentials: true }),

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled

        dispatch(auctionActions.setAuction({ isBetsClosed: true }))
      },
    }),
    closeBets: builder.query<void, UpdateBetsStatusQueryArgs>({
      query: ({ auctionUUID }) => ({ url: `/${auctionUUID}/close-bets` }),

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled

        dispatch(auctionActions.setAuction({ isBetsClosed: true }))
      },
    }),
    openBets: builder.query<void, UpdateBetsStatusQueryArgs>({
      query: ({ auctionUUID }) => ({ url: `/${auctionUUID}/open-bets` }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled

        dispatch(auctionActions.setAuction({ isBetsClosed: false }))
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useCloseBetsQuery,
  useLazyCloseBetsQuery,
  useOpenBetsQuery,
  useLazyOpenBetsQuery,
} = updateBetsStatusApi
