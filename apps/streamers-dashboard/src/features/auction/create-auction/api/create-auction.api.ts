import { splittedAuctionApi } from '~entities/auction/api'

import { CreateAuctionFormData } from '../model'

type CreateAuctionQueryArgs = CreateAuctionFormData

type CreateAuctionQueryReturnValue = {
  auctionUUID: string
  url: string
  auctionOwnerId: string
}

const createAuctionApi = splittedAuctionApi.injectEndpoints({
  endpoints: (builder) => ({
    createAuction: builder.mutation<
      CreateAuctionQueryReturnValue,
      CreateAuctionQueryArgs
    >({
      query: ({ key }) => ({
        url: '/create',
        data: { key },
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'POST',
        withCredentials: false,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useCreateAuctionMutation } = createAuctionApi
