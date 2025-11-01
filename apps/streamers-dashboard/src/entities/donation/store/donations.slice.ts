import type { PayloadAction } from '@reduxjs/toolkit'

import type {
  DonatePayDonation,
  DonationAlertsDonation,
  ProcessedDonation,
  ProcessedDonationStatus,
  TwitchDonation,
  UserCustomDonation,
} from '../model'

import { createSlice } from '@reduxjs/toolkit'

import { getDonationsStatsThunk } from '../api'

// const createFakeDonations = (count: number) => {
//   let idCount = 0

//   const getFromFakerArray = <T>(...elements: T[]) => {
//     return faker.helpers.arrayElement<T>(elements)
//   }

//   return Array.from({ length: count }).map<DonationAlertsDonation>(_ => ({
//     id: ++idCount,
//     auctionId: 2,
//     amount: faker.number.int({ min: 200, max: 50000 }),
//     currency: faker.finance.currency().code,
//     message: faker.word.words({ count: { min: 5, max: 20 } }),
//     messageType: getFromFakerArray<DonationAlertsDonation['messageType']>('audio', 'empty', 'text'),
//     source: 'donationAlerts',
//     username: faker.internet.username(),
//     createdAt: faker.date.recent().toUTCString(),
//     updatedAt: faker.date.recent().toUTCString(),
//     sourceDonationId: 12,
//     processData: {
//       action: getFromFakerArray<DonationAlertsDonation['processData']['action']>('createSlot', 'noAction', 'updateSlot'),
//       slotsIds: [faker.number.int(), faker.number.int()],
//       status: getFromFakerArray<DonationAlertsDonation['processData']['status']>('added', 'checkRequested', 'empty', 'error', 'inProgress', 'rejected'),
//     },
//   }))
// }

type DonationsSliceState = {
  donations: {
    all: ProcessedDonation[]
    donationAlerts: DonationAlertsDonation[]
    donatePay: DonatePayDonation[]
    twitch: TwitchDonation[]
    userInput: UserCustomDonation[]
  }
  donationsStatusesCounts: Record<ProcessedDonationStatus, number>
}

const initialState: DonationsSliceState = {
  donations: {
    all: [],
    donatePay: [],
    donationAlerts: [],
    twitch: [],
    userInput: [],
  },
  donationsStatusesCounts: {
    added: 0,
    checkRequested: 0,
    empty: 0,
    error: 0,
    inProgress: 0,
    rejected: 0,
  },
}

const slice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    addDonation(state, action: PayloadAction<ProcessedDonation | ProcessedDonation[]>) {
      const pushDonation = (donation: ProcessedDonation) => {
        switch (donation.source) {
          case 'donationAlerts': {
            state.donations.all.push(donation)
            state.donations.donationAlerts.push(
              donation as DonationAlertsDonation,
            )
            break
          }
          case 'donatePay': {
            state.donations.all.push(donation)
            state.donations.donatePay.push(donation as DonatePayDonation)
            break
          }
          default: {
            state.donations.all.push(donation)
          }
        }
      }

      const donations = action.payload

      if (Array.isArray(donations)) {
        const filtredSlotsForAdding = donations.filter((donation) => {
          const isNotExist = !state.donations.all.find(item => item.id === donation.id)
          return isNotExist
        })

        filtredSlotsForAdding.forEach(pushDonation)
      }
      else {
        const isNotExist = !state.donations.all.find(item => item.id === donations.id)
        if (isNotExist) {
          pushDonation(donations)
        }
      }
    },
    updateDonationsStatusesCounts(state, action: PayloadAction<Partial<Record<ProcessedDonationStatus, number>>>) {
      const counts = action.payload;

      (Object.keys(counts) as Array<ProcessedDonationStatus>).forEach((status) => {
        if (counts[status])
          state.donationsStatusesCounts[status] = counts[status]
      })
    },
    updateDonation(state, action: PayloadAction<Partial<ProcessedDonation>>) {
      const { id, source, ...restDonationData } = action.payload

      const collection = state.donations.all
      const donationIndex = collection.findIndex(donation => donation.id === id)

      if (donationIndex === -1)
        return

      const updatedDonation = { ...collection[donationIndex], ...restDonationData }

      state.donations.all = [
        ...collection.slice(0, donationIndex),
        updatedDonation,
        ...collection.slice(donationIndex + 1),
      ]
    },
    setDonationsStatusesCounts(state, action: PayloadAction<Record<ProcessedDonationStatus, number>>) {
      const counts = action.payload

      state.donationsStatusesCounts = counts
    },
  },
  selectors: {
    getDonationsStatusesCounts(state) {
      return state.donationsStatusesCounts
    },
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
      return state.donations.all
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDonationsStatsThunk.fulfilled, (state, action) => {
      const { payload } = action

      if (!payload)
        return

      state.donationsStatusesCounts = { ...state.donationsStatusesCounts, ...payload }
    })
  },
})

export const {
  actions: donationsActions,
  reducer: donationsReducer,
  selectors: donationsSelectors,
} = slice
