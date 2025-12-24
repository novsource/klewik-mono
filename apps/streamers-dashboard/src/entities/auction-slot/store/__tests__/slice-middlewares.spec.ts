import type { Store, UnknownAction } from '@reduxjs/toolkit'

import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { AUCTION_SLOTS_SLICE_INITIAL_STATE as initialState } from '~entities/auction-slot/constants'
import type { AuctionSlot } from '~entities/auction-slot/model'

import { auctionSlotsListenerMiddlewares } from '../auction-slots.middlewares'
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
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware()
        .prepend([
          ...auctionSlotsListenerMiddlewares,
        ]),
  })

  state = store.getState().auctionSlots
})

describe('auction slots slice middlewares', () => {
  it('should update slots points sum on slots adding', () => {
    const points = 1000

    expect(state.slotsPointsSum).toBe(initialState.slotsPointsSum)

    const previousPointsSum = state.slotsPointsSum

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

    const addedPointsSum = addedSlotArr.reduce((acc, slot) => acc + slot.points, 0)

    dispatch(auctionSlotsActions.addSlots(addedSlotArr))
    expect(state.slotsPointsSum).toBe(previousPointsSum + addedPointsSum)
  })

  it('should update slots points sum on slot updating', () => {
    const randomSlotIndex = Math.floor(Math.random() * state.slots.length)
    const targetSlot = state.slots[randomSlotIndex]

    const points = Math.floor(Math.random() * 1_000)

    const previousPointsSum = state.slotsPointsSum
    const changes = points - targetSlot.points

    dispatch(auctionSlotsActions.updateSlot({ id: targetSlot.id, data: { ...targetSlot, points } }))
    expect(state.slotsPointsSum).toBe(previousPointsSum + changes)
  })
})
