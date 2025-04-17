import { faker } from '@faker-js/faker'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import {
  DonatePayDonation,
  DonationAlertsDonation,
  ProcessedDonation,
} from '../model'

const mockedDonAlertsDonations = Array<ProcessedDonation | null>(30)
  .fill(null)
  .map<ProcessedDonation>((_, index) => {
    const message = faker.lorem.words({ min: 10, max: 35 })
    return {
      amount: Math.random() * 50000,
      currency: 'USD',
      id: index,
      message,
      message_type: ['text', 'audio'][faker.number.int({ min: 0, max: 1 })],
      processingStatus: ['added', 'error', 'confirm', 'empty'][
        faker.number.int({ min: 0, max: 3 })
      ],
      provider: 'donationAlerts',
      username: faker.internet.username(),
    }
  })

type DonationsSliceState = {
  donations: {
    donationAlerts: DonationAlertsDonation[]
    donatePay: DonatePayDonation[]
  }
}

const initialState: DonationsSliceState = {
  donations: {
    donatePay: [],
    donationAlerts: mockedDonAlertsDonations || [],
  },
}

const slice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    addDonation(state, action: PayloadAction<ProcessedDonation>) {
      const payload = action.payload

      switch (payload.provider) {
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
        provider: ProcessedDonation['provider']
      }
    ) {
      return state.donations[options.provider].find(
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
