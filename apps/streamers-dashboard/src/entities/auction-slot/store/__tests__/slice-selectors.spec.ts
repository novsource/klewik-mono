import type { UnknownAction } from '@reduxjs/toolkit'

import { AUCTION_SLOTS_SLICE_INITIAL_STATE as initialState } from '~entities/auction-slot/constants'

import { auctionSlotsReducer } from '../auction-slots.slice'

function createState(action: UnknownAction = { type: 'unknown' }) {
  return auctionSlotsReducer(undefined, action)
}

describe('auction slots slice selectors', () => {
  it('should use correct initial state', () => {
    const state = createState()
    expect(state).toEqual(initialState)
  })

  it('should return slots', () => {
    const state = createState()
    expect(state.slots).toEqual(initialState.slots)
  })

  it('should return dropout slots', () => {
    const state = createState()
    expect(state.dropoutSlots).toEqual(initialState.dropoutSlots)
  })

  it('should return slots points sum', () => {
    const state = createState()
    expect(state.slotsPointsSum).toEqual(initialState.slotsPointsSum)
  })

  it('should return sort options', () => {
    const state = createState()
    expect(state.sortingOptions).toEqual(initialState.sortingOptions)
  })
})
