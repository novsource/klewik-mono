import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'

import type { AuctionSlotDTO } from '~shared/api/sse/clients/auction-slots'

type EditSlotApiArgs = {
  auctionUUID: string
  slot: Omit<AuctionSlotDTO, 'auctionSlotOrder'>
}

const editSlotApi = splittedAuctionSlotsApi.injectEndpoints({
  endpoints: builder => ({
    editSlot: builder.mutation<void, EditSlotApiArgs>({
      query: ({ auctionUUID, slot }) => ({
        url: `/${auctionUUID}/slots/${slot.id}/update`,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        data: slot,
      }),
    }),
  }),
})

export const { useEditSlotMutation } = editSlotApi
