import type { Store } from '@reduxjs/toolkit'

import type { DonationsSliceState } from '../donations.slice'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { getDonationsStatsThunk } from '~entities/donation/api'

import { donationsReducer } from '../donations.slice'

const fakeStat = () => Math.floor(Math.random() * 15)

const fakeDonationStats: DonationsSliceState['donationsStatusesCounts'] = {
  added: fakeStat(),
  checkRequested: fakeStat(),
  empty: fakeStat(),
  error: fakeStat(),
  inProgress: fakeStat(),
  rejected: fakeStat(),
}

const getDonationStatsRequestHandler = http.get(
  `http://localhost:3000/api/v1/auctions/${1}/donations/stats`,
  () => {
    return HttpResponse.json(fakeDonationStats)
  },
)
const server = setupServer(getDonationStatsRequestHandler)

let store: Store<{ donations: ReturnType<typeof donationsReducer> }>

beforeAll(() => server.listen())

beforeEach(() => {
  store = configureStore({
    reducer: combineReducers({ donations: donationsReducer }),
  })
})

afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('donations slice extra reducers', () => {
  it('should update donations statuses counts on thunk fullfilled', async () => {
    const response = await store.dispatch<any>(getDonationsStatsThunk('1')) as Awaited<ReturnType<ReturnType<typeof getDonationsStatsThunk>>>

    expect(response.payload).toEqual(fakeDonationStats)
    expect(store.getState().donations.donationsStatusesCounts).toEqual(fakeDonationStats)
  })
})
