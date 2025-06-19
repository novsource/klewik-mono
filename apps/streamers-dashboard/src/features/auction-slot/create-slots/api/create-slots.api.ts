import { Auction } from '~entities/auction/model'

import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'
import { AuctionSlot } from '~entities/auction-slot/model'

type CreateSlotsQueryArgs = {
  auctionUUID: Auction['auctionUUID']
  slots: Array<Omit<AuctionSlot, 'id' | 'color'>>
}

const createSlotsApi = splittedAuctionSlotsApi.injectEndpoints({
  endpoints: (build) => ({
    createSlots: build.mutation<void, CreateSlotsQueryArgs>({
      query: ({ auctionUUID, slots }) => ({
        url: `/${auctionUUID}/create-slots`,
        data: {
          slots,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        withCredentials: false,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useCreateSlotsMutation } = createSlotsApi
