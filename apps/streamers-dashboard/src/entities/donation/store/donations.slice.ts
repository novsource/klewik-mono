import type { PayloadAction } from '@reduxjs/toolkit'

import type {
  DonatePayDonation,
  Donation,
  DonationAlertsDonation,
  ProcessedDonation,
  ProcessedDonationStatus,
  TwitchDonation,
  UserCustomDonation,
} from '../model'

import { createSlice } from '@reduxjs/toolkit'

import { getDonationsStatsThunk } from '../api'
import { DONATIONS_SLICE_INITIAL_STATE as initialState } from '../constants'

export type DonationsSliceState = {
  rawDonations: Donation[]
  donations: {
    all: ProcessedDonation[]
    donationAlerts: DonationAlertsDonation[]
    donatePay: DonatePayDonation[]
    twitch: TwitchDonation[]
    userInput: UserCustomDonation[]
  }
  donationsStatusesCounts: Record<ProcessedDonationStatus, number>
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
    deleteRawDonation(state, action: PayloadAction<number>) {
      state.rawDonations = state.rawDonations.filter(donation => donation.id !== action.payload)
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
    getRawDonation(state, id: number) {
      return state.rawDonations.find(
        donation => donation.id === id,
      )
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
    getAllRawDonations(state) {
      return state.rawDonations
    },
    getRawDonationById(state, id: number) {
      return state.rawDonations.find(donation => donation.id === id)
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
