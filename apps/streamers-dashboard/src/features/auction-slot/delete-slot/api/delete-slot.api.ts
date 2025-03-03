import { Auction } from '~entities/auction/model'

import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'
import { AuctionSlot } from '~entities/auction-slot/model'

type DeleteSlotRequestArgs = {
  auctionId: Auction['id']
  slotId: AuctionSlot['id']
}

const deleteSlotApi = splittedAuctionSlotsApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteSlot: builder.mutation<void, DeleteSlotRequestArgs>({
      query: ({ auctionId, slotId }) => ({
        url: `/${auctionId}/delete-slot`,
        data: { id: slotId },
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }),
    }),
  }),
})

export const { useDeleteSlotMutation } = deleteSlotApi
