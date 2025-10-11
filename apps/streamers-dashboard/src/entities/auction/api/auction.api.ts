import type { Auction } from '../model'

import { createAsyncThunk } from '@reduxjs/toolkit'
import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosError, isAxiosError } from 'axios'

import { getAuctionInfo } from '~shared/api/http/auction/auction.api'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

import { auctionActions } from '../store'

export type GetAuctionInfoQueryArgs = {
  auctionUUID: Auction['auctionUUID']
}

export const getAuctionInfoThunk = createAsyncThunk('auction/getAuctionInfo', async (auctionUUID: string) => {
  try {
    const response = await getAuctionInfo<Auction>(auctionUUID)

    if (response.status === 404) {
      throw new AxiosError('Can\'t get auction info', '404')
    }

    if (!response.data) {
      throw new AxiosError('Can\'t get auction info', '500')
    }

    return response.data
  }
  catch (error) {
    if (error instanceof Error || isAxiosError(error))
      throw error
  }
})

export type UpdateBetsStatusQueryArgs = {
  auctionUUID: Auction['auctionUUID']
  status: boolean
}

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
    updateBetsStatus: builder.mutation<void, UpdateBetsStatusQueryArgs>({
      query: ({ auctionUUID, status }) => ({
        url: `/${auctionUUID}/bets/status`,
        data: { status },
        method: 'POST',
        withCredentials: true,
      }),
      onQueryStarted: async ({ status }, { dispatch, queryFulfilled }) => {
        await queryFulfilled
        dispatch(auctionActions.setAuction({ isBetsClosed: status }))
      },
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
  useUpdateBetsStatusMutation,
}
  = splittedAuctionApi
