import type { Store, UnknownAction } from '@reduxjs/toolkit'

import { faker } from '@faker-js/faker'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { DONATIONS_SLICE_INITIAL_STATE as initialState } from '~entities/donation/constants'
import type { DonationAlertsDonation } from '~entities/donation/model'

import { donationsListenerMiddlewares } from '../donations.middlewares'
import { donationsActions, donationsReducer } from '../donations.slice'

const getFromFakerArray = <T>(...elements: T[]) => {
  return faker.helpers.arrayElement<T>(elements)
}

let donationCount = 1

const createFakeDonation: () => DonationAlertsDonation = () => ({
  id: donationCount++,
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
    addedPoints: null,
    title: null,
    donationCode: null,
  },
})

let state: ReturnType<typeof donationsReducer>
let store: Store<{ donations: typeof state }>

const dispatch = (action: UnknownAction) => {
  store.dispatch(action)
  state = store.getState().donations
}

beforeEach(() => {
  store = configureStore({
    reducer: combineReducers({ donations: donationsReducer }),
    middleware: (getDefaultMiddlewares) => {
      return getDefaultMiddlewares().prepend(...donationsListenerMiddlewares)
    },
  })

  state = store.getState().donations
})

describe('donations slice middlewares', () => {
  it('should update donations statuses counts on adding single donation', () => {
    const fakeDonation = createFakeDonation()
    dispatch(donationsActions.addDonation(fakeDonation))

    expect(state.donationsStatusesCounts).toEqual({ ...initialState.donationsStatusesCounts, [fakeDonation.processData.status]: 1 })
  })

  it('should update donations statuses counts on adding donations array', () => {
    const fakeDonations = Array.from({ length: 5 }).fill(null).map(_ => createFakeDonation())
    dispatch(donationsActions.addDonation(fakeDonations))

    const targetData = fakeDonations.reduce((acc, donation) => {
      const status = donation.processData.status
      acc[status] += 1

      return acc
    }, { ...initialState.donationsStatusesCounts })

    expect(state.donationsStatusesCounts).toEqual(targetData)
  })
})
