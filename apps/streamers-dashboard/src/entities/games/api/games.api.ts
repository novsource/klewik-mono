import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

type DropSlotMutationArgs = {
  auctionUUID: string
  slotId: number
}

type SetAuctionWinnerMutationArgs = {
  auctionUUID: string
  slotId: number
}

export const splittedAuctionGamesApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auctions' }),
  reducerPath: 'auctionGamesApi',
  endpoints: builder => ({
    dropoutSlot: builder.mutation<void, DropSlotMutationArgs>({
      query: ({ auctionUUID, slotId }) => ({
        url: `/${auctionUUID}/slots/dropout`,
        method: 'POST',
        data: {
          slotId,
        },
      }),
    }),
    setAuctionWinner: builder.mutation<void, SetAuctionWinnerMutationArgs>({
      query: ({ auctionUUID, slotId }) => ({
        url: `/${auctionUUID}/slots/winner`,
        method: 'POST',
        data: {
          slotId,
        },
      }),
    }),
  }),
})

export const { useDropoutSlotMutation, useSetAuctionWinnerMutation } = splittedAuctionGamesApi
