import { splittedAuctionApi } from '~entities/auction/api'

export type CreateAuctionQueryReturnValue = {
  auctionUUID: string
  url: string
  auctionOwnerId: string
}

const createAuctionApi = splittedAuctionApi.injectEndpoints({
  endpoints: builder => ({
    createAuction: builder.mutation<CreateAuctionQueryReturnValue, void>({
      query: () => ({
        url: '/create',
        headers: { 'Content-Type': 'multipart/form-data' },
        isBodyFormData: true,
        method: 'POST',
        withCredentials: false,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useCreateAuctionMutation } = createAuctionApi
