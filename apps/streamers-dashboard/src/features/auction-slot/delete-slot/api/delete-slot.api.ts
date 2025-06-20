import { Auction } from '~entities/auction/model'

import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'
import { AuctionSlot } from '~entities/auction-slot/model'

type DeleteSlotRequestArgs = {
  auctionUUID: Auction['auctionUUID']
  slotId: AuctionSlot['id']
}

const deleteSlotApi = splittedAuctionSlotsApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteSlot: builder.mutation<void, DeleteSlotRequestArgs>({
      query: ({ auctionUUID, slotId }) => ({
        url: `/${auctionUUID}/delete-slot`,
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
