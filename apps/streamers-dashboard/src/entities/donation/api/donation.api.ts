import { createAsyncThunk } from '@reduxjs/toolkit'
import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosError, isAxiosError } from 'axios'

import type { ProcessedDonationDTOStatus } from '~shared/api/http/donations'
import { getDonationsStats } from '~shared/api/http/donations'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

import { donationsActions } from '../store'

export const getDonationsStatsThunk = createAsyncThunk(
  'donations/getDonationsStats',
  async (auctionUUID: string, { rejectWithValue }) => {
    try {
      const response = await getDonationsStats(auctionUUID)

      return response.data
    }
    catch (error) {
      if (isAxiosError(error))
        return rejectWithValue(error)

      if (error instanceof Error) {
        return rejectWithValue(new AxiosError(error.message, '500'))
      }
    }
  },
)

type GetDonationsStatsQueryArgs = {
  auctionUUID: string
}

type GetDonationsStatsQueryResultData = Record<ProcessedDonationDTOStatus, number>

export const splittedDonationApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auctions' }),
  reducerPath: 'donationsApi',
  endpoints: builder => ({
    getDonationsStats: builder.query<GetDonationsStatsQueryResultData, GetDonationsStatsQueryArgs>({
      query: ({ auctionUUID }) => ({ url: `/${auctionUUID}/donations/stats` }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const response = await queryFulfilled

        dispatch(donationsActions.setDonationsStatusesCounts(response.data))
      },
    }),
  }),
})
