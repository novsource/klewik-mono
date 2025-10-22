import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'
import type { AuctionSlot } from '~entities/auction-slot/model'

type EditSlotApiArgs = {
  auctionUUID: string
  slot: Omit<AuctionSlot, 'color' | 'auctionSlotOrder'>
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
