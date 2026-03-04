import type { Store, UnknownAction } from '@reduxjs/toolkit'

import { faker } from '@faker-js/faker'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { DONATIONS_SLICE_INITIAL_STATE as initialState } from '~entities/donation/constants'
import type { DonationAlertsDonation } from '~entities/donation/model'

import { donationsActions, donationsReducer, donationsSelectors } from '../donations.slice'

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
  })

  state = store.getState().donations
})

describe('donations slice selectors', () => {
  it('should return donations statuses counts', () => {
    const value = donationsSelectors.getDonationsStatusesCounts({ donations: state })
    expect(value).toEqual(initialState.donationsStatusesCounts)
  })

  it('should return DonationAlerts donations', () => {
    const initialDADonations = donationsSelectors.getDonationAlertsDonations({ donations: state })
    expect(initialDADonations).toEqual([])

    const newDonation = createFakeDonation()
    dispatch(donationsActions.addDonation(newDonation))

    const updatedDonations = donationsSelectors.getDonationAlertsDonations({ donations: state })
    expect(updatedDonations).toEqual([newDonation])
  })

  it('should return all donations', () => {
    const initialDonations = donationsSelectors.getAllDonations({ donations: state })
    expect(initialDonations).toEqual(initialState.donations.all)

    const newDonation = createFakeDonation()
    dispatch(donationsActions.addDonation(newDonation))

    const updatedDonationsState = donationsSelectors.getAllDonations({ donations: state })

    expect(updatedDonationsState).toEqual([newDonation])
  })

  it('should return donation by id', () => {
    const newDonation = createFakeDonation()
    dispatch(donationsActions.addDonation(newDonation))

    const findedDonation = donationsSelectors.getDonationById({ donations: state }, newDonation.id)

    expect(newDonation).toEqual(findedDonation)
  })

  it('should return donation', () => {
    const newDonation = createFakeDonation()
    dispatch(donationsActions.addDonation(newDonation))

    const findedDonation = donationsSelectors.getDonation({ donations: state }, { id: newDonation.id, source: newDonation.source })

    expect(newDonation).toEqual(findedDonation)
  })
})
