import { Auction } from '~entities/auction/model'

import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'
import { AuctionSlot } from '~entities/auction-slot/model'

type CreateSlotsQueryArgs = {
  auctionId: Auction['id']
  slots: Omit<AuctionSlot, 'id' | 'color'>
}

const createSlotsApi = splittedAuctionSlotsApi.injectEndpoints({
  endpoints: (build) => ({
    createSlots: build.mutation<void, CreateSlotsQueryArgs>({
      query: ({ auctionId, slots }) => ({
        url: `/${auctionId}/create-slots`,
        data: {
          slots,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useCreateSlotsMutation } = createSlotsApi
