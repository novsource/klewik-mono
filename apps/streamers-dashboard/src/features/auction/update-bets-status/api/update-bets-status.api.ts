import { splittedAuctionApi } from '~entities/auction/api'
import { Auction } from '~entities/auction/model'
import { auctionActions } from '~entities/auction/store'

type UpdateBetsStatusQueryArgs = {
  auctionId: Auction['id']
}

const updateBetsStatusApi = splittedAuctionApi.injectEndpoints({
  endpoints: (builder) => ({
    closeBets: builder.query<void, UpdateBetsStatusQueryArgs>({
      query: ({ auctionId }) => ({ url: `/${auctionId}/close-bets` }),

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled

        dispatch(auctionActions.setAuction({ isBetsClosed: true }))
      },
    }),
    openBets: builder.query<void, UpdateBetsStatusQueryArgs>({
      query: ({ auctionId }) => ({ url: `/${auctionId}/open-bets` }),
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
