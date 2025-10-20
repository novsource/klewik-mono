import { createAsyncThunk } from '@reduxjs/toolkit'
import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosError, isAxiosError } from 'axios'

import { getAuctionSlots } from '~shared/api/http/auction-slots'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

export const getAuctionSlotsThunk = createAsyncThunk(
  'auctionSlots/getAuctionSlots',
  async (auctionUUID: string, { rejectWithValue }) => {
    try {
      const response = await getAuctionSlots(auctionUUID)

      if (response.status !== 200) {
        throw new AxiosError('Can\'t get auction slots', response.status.toString())
      }

      return response.data
    }
    catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error)
      }

      if (error instanceof Error) {
        return rejectWithValue(new AxiosError(error.message, '500'))
      }
    }
  },
)

const splittedAuctionSlotsApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auctions' }),
  reducerPath: 'auctionSlotsApi',
  endpoints: () => ({}),
})

export { splittedAuctionSlotsApi }
