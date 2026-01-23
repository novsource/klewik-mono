import type { SetAuctionViewParametersFormData } from '../model'

import { splittedAuctionApi } from '~entities/auction/api'
import type { Auction } from '~entities/auction/model'

type SetAuctionViewParametersQueryArgs = {
  auctionUUID: Auction['auctionUUID']
  details: SetAuctionViewParametersFormData
}

const setAuctionViewParametersApi = splittedAuctionApi.injectEndpoints({
  endpoints: builder => ({
    setAuctionViewParameters: builder.mutation<
      void,
      SetAuctionViewParametersQueryArgs
    >({
      query: ({ auctionUUID, details }) => ({
        url: `/${auctionUUID}/view/parameters`,
        data: details,
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useSetAuctionViewParametersMutation }
  = setAuctionViewParametersApi
