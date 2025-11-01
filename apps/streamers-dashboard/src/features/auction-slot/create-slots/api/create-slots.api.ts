import type { Auction } from '~entities/auction/model'

import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'
import type { AuctionSlot } from '~entities/auction-slot/model'

type CreateSlotsQueryArgs = {
  auctionUUID: Auction['auctionUUID']
  slots: Array<Omit<AuctionSlot, 'id' | 'color'>>
}

const createSlotsApi = splittedAuctionSlotsApi.injectEndpoints({
  endpoints: build => ({
    createSlots: build.mutation<AuctionSlot[], CreateSlotsQueryArgs>({
      query: ({ auctionUUID, slots }) => ({
        url: `/${auctionUUID}/slots/create`,
        data: {
          slots,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        withCredentials: true,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useCreateSlotsMutation } = createSlotsApi
