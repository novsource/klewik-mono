import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { IntegrationsPlatforms, integrationsPlatforms } from '../model'

type IntegrationsSliceState = {
  [key in IntegrationsPlatforms]: {
    isConnected: boolean
    isValid: boolean
  }
}

const initialState: IntegrationsSliceState =
  integrationsPlatforms.reduce<IntegrationsSliceState>((acc, curr) => {
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
      }>
    ) {
      const payload = action.payload

      state[payload.platform] = payload.data
    },
  },
  selectors: {
    getDonationAlertsStatus(state) {
      return state['donation-alerts']
    },
    getDonatePayStatus(state) {
      return state['donate-pay']
    },
  },
})

export const {
  actions: integrationsActions,
  reducer: integrationsReducer,
  selectors: integrationsSelectors,
} = integrationsSlice
