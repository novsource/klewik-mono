import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { authHttpClient } from '~shared/api/http'

type DonationAlertsIntegrationStatus = {
  isConnected: boolean
  isValid: boolean
}

type AppStore = {
  auctionId: string
  auctionUrl: string
  integrations: {
    donationAlerts: DonationAlertsIntegrationStatus
  }
}

const initialState: AppStore = {
  auctionId: '',
  auctionUrl: '',
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
    const response = await authHttpClient.get<DonationAlertsIntegrationStatus>(
      `/api/sse/${auctionId}/donalerts/connect`
    )

    return response.data
  }
)

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuctionId: (state, action: PayloadAction<string>) => {
      state.auctionId = action.payload
      state.auctionUrl = `https://auctions.klewik.ru/${action.payload}`
    },
    setAuctionUrl: (state, action: PayloadAction<string>) => {
      state.auctionUrl = action.payload
    },
    setDonationAlertsStatus: (
      state,
      action: PayloadAction<DonationAlertsIntegrationStatus>
    ) => {
      const data = action.payload
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
