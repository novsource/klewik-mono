import { splittedAuctionApi } from '~entities/auction/api'
import type { Auction } from '~entities/auction/model'
import { auctionActions } from '~entities/auction/store'

type UpdateBetsStatusQueryArgs = {
  auctionUUID: Auction['auctionUUID']
  status: Auction['isBetsClosed']
}

const updateBetsStatusApi = splittedAuctionApi.injectEndpoints({
  endpoints: builder => ({
    updateBetsStatus: builder.mutation<void, UpdateBetsStatusQueryArgs>({
      query: ({ auctionUUID, status }) => ({ url: `/${auctionUUID}/bets/status`, data: status, withCredentials: true }),

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled

        dispatch(auctionActions.setAuction({ isBetsClosed: true }))
      },
    }),
    closeBets: builder.mutation<void, UpdateBetsStatusQueryArgs>({
      query: ({ auctionUUID }) => ({ url: `/${auctionUUID}/bets/status` }),

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled

        dispatch(auctionActions.setAuction({ isBetsClosed: true }))
      },
    }),
    openBets: builder.mutation<void, UpdateBetsStatusQueryArgs>({
      query: ({ auctionUUID }) => ({ url: `/${auctionUUID}/bets/status` }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled

        dispatch(auctionActions.setAuction({ isBetsClosed: false }))
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useCloseBetsMutation,
  useOpenBetsMutation,
  useUpdateBetsStatusMutation,
} = updateBetsStatusApi
