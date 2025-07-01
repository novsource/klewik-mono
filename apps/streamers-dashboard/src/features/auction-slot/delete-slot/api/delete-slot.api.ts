import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'
import type { AuctionSlot } from '~entities/auction-slot/model'
import type { Auction } from '~entities/auction/model'

type DeleteSlotRequestArgs = {
  auctionUUID: Auction['auctionUUID']
  slotId: AuctionSlot['id']
}

const deleteSlotApi = splittedAuctionSlotsApi.injectEndpoints({
  endpoints: builder => ({
    deleteSlot: builder.mutation<void, DeleteSlotRequestArgs>({
      query: ({ auctionUUID, slotId }) => ({
        url: `/${auctionUUID}/slots/${slotId}`,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      }),
    }),
  }),
})

export const { useDeleteSlotMutation } = deleteSlotApi
