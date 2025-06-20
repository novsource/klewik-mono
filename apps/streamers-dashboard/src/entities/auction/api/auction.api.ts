import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

import { Auction } from '../model'

type GetAuctionInfoQueryArgs = {
  auctionUUID: Auction['auctionUUID']
}

const splittedAuctionApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auctions' }),
  reducerPath: 'auctionApi',
  endpoints: (builder) => ({
    getAuctionInfo: builder.query<Auction, GetAuctionInfoQueryArgs>({
      query: ({ auctionUUID }) => ({ url: `/${auctionUUID}` }),
    }),
  }),
})

export { splittedAuctionApi }
export const { useLazyGetAuctionInfoQuery, useGetAuctionInfoQuery } =
  splittedAuctionApi
