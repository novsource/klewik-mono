import type { Store, UnknownAction } from '@reduxjs/toolkit'

import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { AUCTION_SLOTS_SLICE_INITIAL_STATE as initialState } from '~entities/auction-slot/constants'
import type { AuctionSlot } from '~entities/auction-slot/model'

import type { SortingOptions } from '~shared/store/model'

import { auctionSlotsActions, auctionSlotsReducer } from '../auction-slots.slice'

let state: ReturnType<typeof auctionSlotsReducer>
let store: Store<{ auctionSlots: typeof state }>

const dispatch = (action: UnknownAction) => {
  store.dispatch(action)
  state = store.getState().auctionSlots
}

beforeEach(() => {
  store = configureStore({
    reducer: combineReducers({ auctionSlots: auctionSlotsReducer }),
  })

  state = store.getState().auctionSlots
})

describe('auction slots slice reducers', () => {
  it('should add slots', () => {
    const points = 1000

    expect(state.slotsPointsSum).toBe(initialState.slotsPointsSum)

    const previousSlots = [...state.slots]

    const addedSlotArr: AuctionSlot[] = [{
      points,
      id: 1000,
      auctionSlotOrder: 1000,
      color: '#FFF',
      title: 'Test',
    }, {
      points,
      id: 1001,
      auctionSlotOrder: 1001,
      color: '#FFF',
      title: 'Test 2',
    }]

    dispatch(auctionSlotsActions.addSlots(addedSlotArr))
    previousSlots.push(...addedSlotArr)

    expect(state.slots).toEqual(previousSlots)
  })

  it('should update slot', () => {
    const randomSlotIndex = Math.floor(Math.random() * state.slots.length)
    const targetSlot = state.slots[randomSlotIndex]

    dispatch(auctionSlotsActions.updateSlot({ id: targetSlot.id, data: { ...targetSlot, title: 'Updated slot' } }))

    expect(state.slots[randomSlotIndex]).toEqual({ ...targetSlot, title: 'Updated slot' })
  })

  it('should delete slot', () => {
    const randomSlotIndex = Math.floor(Math.random() * state.slots.length)
    const targetSlot = state.slots[randomSlotIndex]

    dispatch(auctionSlotsActions.deleteSlot({ id: targetSlot.id }))

    expect(state.slots).not.include(targetSlot)
  })

  it ('should set sorted slots', () => {
    const points = 1000

    const addedSlotArr: AuctionSlot[] = [{
      points,
      id: 1000,
      auctionSlotOrder: 1000,
      color: '#FFF',
      title: 'Test',
    }, {
      points,
      id: 1001,
      auctionSlotOrder: 1001,
      color: '#FFF',
      title: 'Test 2',
    }]

    expect(state.sortedSlots).toEqual(initialState.sortedSlots)
    dispatch(auctionSlotsActions.setSortedSlots(addedSlotArr))
    expect(state.sortedSlots).toEqual(addedSlotArr)
  })

  it('should set slots sort options', () => {
    const sortOptions: SortingOptions = { field: 'points', type: 'ascending' }

    expect(state.sortingOptions).toEqual(initialState.sortingOptions)
    dispatch(auctionSlotsActions.setSlotsSortOptions(sortOptions))
    expect(state.sortingOptions).toEqual(sortOptions)
  })

  it('should set points sum', () => {
    const pointsSum = 1_000_000

    expect(state.slotsPointsSum).toBe(initialState.slotsPointsSum)
    dispatch(auctionSlotsActions.setPointsSum(pointsSum))
    expect(state.slotsPointsSum).toBe(pointsSum)
  })
})
