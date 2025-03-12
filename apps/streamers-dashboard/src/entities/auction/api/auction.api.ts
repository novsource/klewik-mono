import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

import { Auction } from '../model'

type GetAuctionInfoQueryArgs = {
  auctionId: Auction['id']
}

const splittedAuctionApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auction' }),
  reducerPath: 'auctionApi',
  endpoints: (builder) => ({
    getAuctionInfo: builder.query<Auction, GetAuctionInfoQueryArgs>({
      query: ({ auctionId }) => ({ url: `/${auctionId}/info` }),
    }),
  }),
})

export { splittedAuctionApi }
export const { useLazyGetAuctionInfoQuery, useGetAuctionInfoQuery } =
  splittedAuctionApi
