import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'
import { AuctionSlot } from '~entities/auction-slot/model'

type EditSlotApiArgs = {
  auctionId: string
  slot: Omit<AuctionSlot, 'color'>
}

const editSlotApi = splittedAuctionSlotsApi.injectEndpoints({
  endpoints: (builder) => ({
    editSlot: builder.mutation<void, EditSlotApiArgs>({
      query: ({ auctionId, slot }) => ({
        url: `/${auctionId}/update-slot`,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        data: slot,
      }),
    }),
  }),
})

export const { useEditSlotMutation } = editSlotApi
