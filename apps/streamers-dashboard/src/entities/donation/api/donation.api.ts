import { createAsyncThunk } from '@reduxjs/toolkit'
import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosError, isAxiosError } from 'axios'

import { getDonationsStats } from '~shared/api/http/donations'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

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

export const splittedDonationApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auctions' }),
  reducerPath: 'donationsApi',
  endpoints: () => ({}),
})
