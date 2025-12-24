import type { Auction } from '~entities/auction/model'

import { splittedWheelApi } from '~entities/wheel/api'

type SpinWheelMutationArgs = {
  auctionUUID: Auction['auctionUUID']
  mode: Auction['wheelMode']
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
