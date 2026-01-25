import { splittedAuctionApi } from '~entities/auction/api'

type DeleteAuctionMutationArgs = {
  auctionUUID: string
}

const deleteAuctionApi = splittedAuctionApi.injectEndpoints({
  endpoints: builder => ({
    deleteAuction: builder.mutation<void, DeleteAuctionMutationArgs>({ query: ({ auctionUUID }) => ({ url: `/${auctionUUID}/delete`, method: 'POST' }) }),
  }),
})

export const { useDeleteAuctionMutation } = deleteAuctionApi
