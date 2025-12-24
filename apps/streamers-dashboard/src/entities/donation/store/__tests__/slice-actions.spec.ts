import type { Store, UnknownAction } from '@reduxjs/toolkit'

import { faker } from '@faker-js/faker'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { DONATIONS_SLICE_INITIAL_STATE as initialState } from '~entities/donation/constants'
import type { DonationAlertsDonation } from '~entities/donation/model'

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
  })

  state = store.getState().donations
})

describe('donations slice actions', () => {
  it('should add single donation', () => {
    const newDonation = createFakeDonation()

    expect(state.donations.all).toEqual([])
    expect(state.donations.donationAlerts).toEqual([])

    dispatch(donationsActions.addDonation(newDonation))

    expect(state.donations.all).toEqual([newDonation])
    expect(state.donations.donationAlerts).toEqual([newDonation])
  })

  it('should add donations array', () => {
    const newDonationArr = Array.from({ length: 10 }).fill(null).map(_ => createFakeDonation())

    expect(state.donations.all).toEqual([])
    expect(state.donations.donationAlerts).toEqual([])

    dispatch(donationsActions.addDonation(newDonationArr))

    expect(state.donations.all).toEqual(newDonationArr)
    expect(state.donations.donationAlerts).toEqual(newDonationArr)
  })

  it('should update donation', () => {
    const newDonation = createFakeDonation()

    dispatch(donationsActions.addDonation(newDonation))

    const target = state.donations.all[0]
    const newDonationData = { ...createFakeDonation(), id: target.id }

    dispatch(donationsActions.updateDonation(newDonationData))
    expect(state.donations.all[0]).toEqual(newDonationData)
  })

  it('should update donations statuses counts', () => {
    expect(state.donationsStatusesCounts).toEqual(initialState.donationsStatusesCounts)

    dispatch(donationsActions.updateDonationsStatusesCounts({ added: 10 }))

    expect(state.donationsStatusesCounts.added).toBe(10)
  })
})
