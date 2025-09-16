import type { Auction } from '../model'

import { createAsyncThunk } from '@reduxjs/toolkit'
import { createApi } from '@reduxjs/toolkit/query/react'

import { getAuctionInfo } from '~shared/api/http/auction/auction.api'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

export type GetAuctionInfoQueryArgs = {
  auctionUUID: Auction['auctionUUID']
}

export const getAuctionInfoThunk = createAsyncThunk('auction/getAuctionInfo', async (auctionUUID: string) => {
  const response = await getAuctionInfo<Auction>(auctionUUID)

  return response.data
})

export type SearchQueryDomain = 'slots' | 'donations'

export type SearchQueryArgs = {
  auctionUUID: string
  query: string
  domain: SearchQueryDomain
  limit?: number
  before?: number
  after?: number
}

export const splittedAuctionApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auctions' }),
  reducerPath: 'auctionApi',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Info'],
  endpoints: builder => ({
    getAuctionInfo: builder.query<Auction, GetAuctionInfoQueryArgs>({
      query: ({ auctionUUID }) => ({ url: `/${auctionUUID}` }),
      providesTags: ['Info'],
    }),
    search: builder.query<unknown[], SearchQueryArgs>((
      { query: ({ auctionUUID, ...params }) => (
        {
          url: `/${auctionUUID}/search`,
          params,
          withCredentials: true,
        }) }
    )),
  }),
})

export const {
  useLazyGetAuctionInfoQuery,
  useGetAuctionInfoQuery,
  useLazySearchQuery,
  useSearchQuery,
}
  = splittedAuctionApi
