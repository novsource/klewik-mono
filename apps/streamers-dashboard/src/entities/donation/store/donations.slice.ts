import type { PayloadAction } from '@reduxjs/toolkit'

import type {
  DonatePayDonation,
  DonationAlertsDonation,
  ProcessedDonation,
  TwitchDonation,
  UserCustomDonation,
} from '../model'

import { faker } from '@faker-js/faker'
import { createSlice } from '@reduxjs/toolkit'

const createFakeDonations = (count: number) => {
  let idCount = 0

  const getFromFakerArray = <T>(...elements: T[]) => {
    return faker.helpers.arrayElement<T>(elements)
  }

  return Array.from({ length: count }).map<DonationAlertsDonation>(_ => ({
    id: ++idCount,
    auctionId: 2,
    amount: faker.number.int({ min: 200, max: 50000 }),
    currency: faker.finance.currency().code,
    message: faker.word.words({ count: { min: 5, max: 20 } }),
    messageType: getFromFakerArray<DonationAlertsDonation['messageType']>('audio', 'empty', 'text'),
    source: 'donationAlerts',
    username: faker.internet.username(),
    createdAt: faker.date.recent().toUTCString(),
    updatedAt: faker.date.recent().toUTCString(),
    sourceDonationId: 12,
    processData: {
      action: getFromFakerArray<DonationAlertsDonation['processData']['action']>('createSlot', 'noAction', 'updateSlot'),
      slotsIds: [faker.number.int(), faker.number.int()],
      status: getFromFakerArray<DonationAlertsDonation['processData']['status']>('added', 'checkRequested', 'empty', 'error', 'inProgress', 'rejected'),
    },
  }))
}

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
    donationAlerts: createFakeDonations(16),
    twitch: [],
    userInput: [],
  },
}

const slice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    addDonation(
      state,
      action: PayloadAction<ProcessedDonation | ProcessedDonation[]>,
    ) {
      const pushDonation = (donation: ProcessedDonation) => {
        switch (donation.source) {
          case 'donationAlerts': {
            state.donations.donationAlerts.push(
              donation as DonationAlertsDonation,
            )
            break
          }
          case 'donatePay': {
            state.donations.donatePay.push(donation as DonatePayDonation)
            break
          }
        }
      }

      const payload = action.payload

      if (Array.isArray(payload)) {
        payload.forEach(pushDonation)
      }
      else {
        pushDonation(payload)
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
      },
    ) {
      return state.donations[options.source].find(
        donation => donation.id === options.id,
      )
    },
    getDonationById(state, id: ProcessedDonation['id']) {
      return [
        ...state.donations.donationAlerts,
        ...state.donations.donatePay,
      ].find(donation => donation.id === id)
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

export { donationsActions, donationsReducer, donationsSelectors }
