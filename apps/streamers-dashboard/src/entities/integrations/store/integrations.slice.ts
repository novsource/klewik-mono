import type { PayloadAction } from '@reduxjs/toolkit'

import type { IntegrationsPlatforms } from '../model'

import { createSlice } from '@reduxjs/toolkit'

import { integrationsPlatforms } from '../model'

type IntegrationsSliceState = {
  [key in IntegrationsPlatforms]: {
    isConnected: boolean
    isValid: boolean
  }
}

const initialState: IntegrationsSliceState
  = integrationsPlatforms.reduce<IntegrationsSliceState>((acc, curr) => {
    acc[curr] = {
      isConnected: false,
      isValid: false,
    }
    return acc
  }, {} as IntegrationsSliceState)

const integrationsSlice = createSlice({
  name: 'integrations',
  initialState,
  reducers: {
    setPlatformStatus(
      state,
      action: PayloadAction<{
        platform: IntegrationsPlatforms
        data: IntegrationsSliceState[IntegrationsPlatforms]
      }>,
    ) {
      const payload = action.payload

      state[payload.platform] = payload.data
    },
  },
  selectors: {
    getDonationAlertsStatus(state) {
      return state.donationAlerts
    },
    getDonatePayStatus(state) {
      return state.donatePay
    },
    getAllIntegrationsStatuses(state) {
      return state
    },
  },
})

export const {
  actions: integrationsActions,
  reducer: integrationsReducer,
  selectors: integrationsSelectors,
} = integrationsSlice
