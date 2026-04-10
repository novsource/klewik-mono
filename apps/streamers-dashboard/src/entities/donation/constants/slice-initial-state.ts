import type { DonationsSliceState } from '../store/donations.slice'

export const DONATIONS_SLICE_INITIAL_STATE: DonationsSliceState = {
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
