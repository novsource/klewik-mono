import type { DonationsSliceState } from '../store/donations.slice'

import { createFakeDonationsArray } from '../model/__tests__/donations.mocks'

export const DONATIONS_SLICE_INITIAL_STATE: DonationsSliceState = {
  rawDonations: import.meta.env.DEV ? createFakeDonationsArray({ minLength: 100, maxLength: 200 }) : [],
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
