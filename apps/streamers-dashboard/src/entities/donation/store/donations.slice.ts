import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { DonatePayDonation, Donation, DonationAlertsDonation } from '../model'

type DonationsSliceState = {
  donations: {
    donationAlerts: DonationAlertsDonation[]
    donatePay: DonatePayDonation[]
  }
}

const initialState: DonationsSliceState = {
  donations: {
    donatePay: [],
    donationAlerts: [],
  },
}

const slice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    addDonation(state, action: PayloadAction<Donation>) {
      const payload = action.payload

      switch (payload.provider) {
        case 'donation-alerts': {
          state.donations.donationAlerts.push(payload as DonationAlertsDonation)
          break
        }
        case 'donate-pay': {
          state.donations.donatePay.push(payload as DonatePayDonation)
          break
        }
      }
    },
  },
  selectors: {
    getDonationAlertsDonations(state) {
      return state.donations.donationAlerts
    },
    getDonatePayDonations(state) {
      return state.donations.donatePay
    },
    getAllDonations(state) {
      return (
        Object.keys(state.donations) as Array<
          keyof DonationsSliceState['donations']
        >
      ).reduce<Donation[]>((acc, providerName) => {
        acc = [...acc, ...state.donations[providerName]]
        return acc
      }, [])
    },
  },
})

const {
  actions: donationsActions,
  reducer: donationsReducer,
  selectors: donationsSelectors,
} = slice

export { donationsActions, donationsSelectors, donationsReducer }
