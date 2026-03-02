import type { Auction } from '~entities/auction/model'

import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'

import type { AuctionSlotDTO } from '~shared/api/sse/clients/auction-slots'

type CreateSlotsQueryArgs = {
  auctionUUID: Auction['auctionUUID']
  slots: Array<Omit<AuctionSlotDTO, 'id' | 'auctionSlotOrder'>>
}

const createSlotsApi = splittedAuctionSlotsApi.injectEndpoints({
  endpoints: build => ({
    createSlots: build.mutation<AuctionSlotDTO[], CreateSlotsQueryArgs>({
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
