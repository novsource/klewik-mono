import { splittedAuctionApi } from '~entities/auction/api'
import { Auction } from '~entities/auction/model'

import { SetAuctionViewParametersFormData } from '../model'

type SetAuctionViewParametersQueryArgs = {
  auctionId: Auction['id']
  parameters: SetAuctionViewParametersFormData
}

const setAuctionViewParametersApi = splittedAuctionApi.injectEndpoints({
  endpoints: (builder) => ({
    setAuctionViewParameters: builder.mutation<
      void,
      SetAuctionViewParametersQueryArgs
    >({
      query: ({ auctionId, parameters }) => ({
        url: `/${auctionId}/view/parameters`,
        data: parameters,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useSetAuctionViewParametersMutation } =
  setAuctionViewParametersApi
