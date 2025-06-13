import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import {
  DonatePayDonation,
  DonationAlertsDonation,
  ProcessedDonation,
  TwitchDonation,
  UserCustomDonation,
} from '../model'

type DonationsSliceState = {
  donations: {
    donationAlerts: DonationAlertsDonation[]
    donatePay: DonatePayDonation[]
    twitch: TwitchDonation[]
    userInput: UserCustomDonation[]
  }
}

const initialState: DonationsSliceState = {
  donations: {
    donatePay: [],
    donationAlerts: [],
    twitch: [],
    userInput: [],
  },
}

const slice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    addDonation(state, action: PayloadAction<ProcessedDonation>) {
      const payload = action.payload

      switch (payload.source) {
        case 'donationAlerts': {
          state.donations.donationAlerts.push(payload as DonationAlertsDonation)
          break
        }
        case 'donatePay': {
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
    getDonation(
      state,
      options: {
        id: ProcessedDonation['id']
        source: ProcessedDonation['source']
      }
    ) {
      return state.donations[options.source].find(
        (donation) => donation.id === options.id
      )
    },
    getDonationById(state, id: ProcessedDonation['id']) {
      return [
        ...state.donations['donationAlerts'],
        ...state.donations['donatePay'],
      ].find((donation) => donation.id === id)
    },
    getAllDonations(state) {
      return (
        Object.keys(state.donations) as Array<
          keyof DonationsSliceState['donations']
        >
      ).reduce<ProcessedDonation[]>((acc, providerName) => {
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
