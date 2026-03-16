import type { Store } from '@reduxjs/toolkit'

import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { AUCTION_SLOTS_SLICE_INITIAL_STATE as initialState } from '~entities/auction-slot/constants'

import { auctionSlotsListenerMiddlewares } from '../auction-slots.middlewares'
import { auctionSlotsReducer } from '../auction-slots.slice'

// function createState(action: UnknownAction = { type: 'unknown' }) {
//   return auctionSlotsReducer(undefined, action)
// }

let state: ReturnType<typeof auctionSlotsReducer>
let store: Store<{ auctionSlots: typeof state }>

beforeEach(() => {
  store = configureStore({
    reducer: combineReducers({ auctionSlots: auctionSlotsReducer }),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware()
        .prepend([
          ...auctionSlotsListenerMiddlewares,
        ]),
  })

  state = store.getState().auctionSlots
})

describe('auction slots slice selectors', () => {
  it('should use correct initial state', () => {
    expect(state).toEqual(initialState)
  })

  it('should return slots', () => {
    expect(state.slots).toEqual(initialState.slots)
  })

  it('should return alived slots ids', () => {
    expect(state.alivedSlotsIds).toEqual(initialState.alivedSlotsIds)
  })

  it('should return dropped slots ids', () => {
    expect(state.droppedSlotsIds).toEqual(initialState.droppedSlotsIds)
  })

  it('should return slots points sum', () => {
    expect(state.slotsPointsSum).toEqual(initialState.slotsPointsSum)
  })

  it('should return sort options', () => {
    expect(state.sortingOptions).toEqual(initialState.sortingOptions)
  })
})
