import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { baseHttpClient } from '~shared/api/http/instance'

type DonationAlertsIntegrationStatus = {
  isConnected: boolean
  isValid: boolean
}

type AppStore = {
  auctionId: NullablePossible<string>
  auctionUrl: NullablePossible<string>
  integrations: {
    donationAlerts: DonationAlertsIntegrationStatus
  }
}

const initialState: AppStore = {
  auctionId: null,
  auctionUrl: null,
  integrations: {
    donationAlerts: {
      isConnected: false,
      isValid: false,
    },
  },
}

const connectDonationAlertsSSE = createAsyncThunk(
  'integrations/donAlertsSSE',
  async (auctionId: string) => {
    const response = await baseHttpClient.get<DonationAlertsIntegrationStatus>(
      `/api/sse/${auctionId}/donalerts/connect`,
      { withCredentials: true }
    )

    return response.data
  }
)

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuctionId: (state, payload: PayloadAction<string>) => {
      state.auctionId = payload.payload
      state.auctionUrl = `https://auctions.klewik.ru/${payload.payload}`
    },
    setAuctionUrl: (state, payload: PayloadAction<string>) => {
      state.auctionUrl = payload.payload
    },
    setDonationAlertsStatus: (
      state,
      payload: PayloadAction<DonationAlertsIntegrationStatus>
    ) => {
      const data = payload.payload
      state.integrations.donationAlerts = {
        ...state.integrations.donationAlerts,
        ...data,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectDonationAlertsSSE.fulfilled, (state, action) => {
      state.integrations.donationAlerts = {
        ...state.integrations.donationAlerts,
        ...action.payload,
      }
    })
  },
  selectors: {
    getAuctionId: (state) => {
      return state.auctionId
    },
    getAuctionUrl: (state) => {
      return state.auctionUrl
    },
    getDonationAlertsStatus: (state) => {
      return state.integrations.donationAlerts
    },
  },
})

export const {
  reducer: appReducer,
  actions: appActions,
  selectors: appSelectors,
} = appSlice

export { connectDonationAlertsSSE }
