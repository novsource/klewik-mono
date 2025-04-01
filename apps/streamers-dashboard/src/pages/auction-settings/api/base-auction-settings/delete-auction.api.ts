import { splittedAuctionApi } from '~entities/auction/api'
import { Auction } from '~entities/auction/model'

type DeleteAuctionQueryArgs = {
  auctionId: Auction['id']
}

const deleteAuctionApi = splittedAuctionApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteAuction: builder.mutation<void, DeleteAuctionQueryArgs>({
      query: ({ auctionId }) => ({
        url: `/${auctionId}/delete-auction`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useDeleteAuctionMutation } = deleteAuctionApi
