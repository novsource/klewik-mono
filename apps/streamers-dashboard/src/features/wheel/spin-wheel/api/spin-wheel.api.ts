import type { AuctionGameMode } from '~entities/games/model'

import type { Auction } from '~entities/auction/model'

import { splittedWheelApi } from '~entities/wheel/api'

type SpinWheelMutationArgs = {
  auctionUUID: Auction['uuid']
  mode: AuctionGameMode
  slotId: number
}

const spinWheelApi = splittedWheelApi.injectEndpoints({
  endpoints: builder => ({
    spinWheel: builder.mutation<void, SpinWheelMutationArgs>({
      query: ({ auctionUUID, ...queryData }) => ({ url: `/${auctionUUID}/games/wheel/spin`, data: queryData }),
    }),
  }),
})

export const { useSpinWheelMutation } = spinWheelApi
