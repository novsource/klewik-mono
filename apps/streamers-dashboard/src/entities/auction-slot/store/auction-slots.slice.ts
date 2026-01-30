import type { PayloadAction } from '@reduxjs/toolkit'

import type { AuctionSlot } from '../model'

import { createSlice } from '@reduxjs/toolkit'

import type { SortingOptions } from '~shared/store/model'

import { getAuctionSlotsThunk } from '../api'
import { AUCTION_SLOTS_SLICE_INITIAL_STATE as initialState } from '../constants'

export type AuctionSlotsSliceState = {
  slots: AuctionSlot[]
  dropoutSlots: AuctionSlot[]
  sortedSlots: AuctionSlot[]
  slotsPointsSum: number
  sortingOptions: SortingOptions<AuctionSlot>
}

const slice = createSlice({
  name: 'auctionSlots',
  initialState,
  reducers: {
    addSlots(state, action: PayloadAction<AuctionSlot[]>) {
      const payload = action.payload

      const filtredSlots = state.slots.filter(
        slot => !payload.find(item => slot.id === item.id),
      )

      state.slots = [...filtredSlots, ...payload]
    },
    updateSlot(
      state,
      action: PayloadAction<{
        id: AuctionSlot['id']
        data: Partial<Omit<AuctionSlot, 'id'>>
      }>,
    ) {
      const id = action.payload.id
      const data = action.payload.data

      const updatedSlot = state.slots.find(slot => id === slot.id)

      if (!updatedSlot)
        return

      updatedSlot.title = data.title ?? updatedSlot.title
      updatedSlot.points = data.points ?? updatedSlot.points
    },
    deleteSlot(state, action: PayloadAction<{ id: AuctionSlot['id'] }>) {
      const payload = action.payload

      const filtredSlots = state.slots.filter(slot => slot.id !== payload.id)
      const updatedPointsSum = filtredSlots.reduce((acc, slot) => acc + slot.points, 0)

      state.slots = filtredSlots
      state.slotsPointsSum = updatedPointsSum
    },
    updateSlotsPointsSum(
      state,
      action: PayloadAction<Pick<AuctionSlot, 'id' | 'points'>[]>,
    ) {
      const payload = action.payload

      const filtredSlots = state.slots.filter(
        slot => !payload.find(item => slot.id === item.id),
      )

      if (filtredSlots.length === state.slots.length) {
        state.slotsPointsSum += payload.reduce((a, slot) => a + slot.points, 0)
      }
      else {
        state.slotsPointsSum
          = filtredSlots.reduce((a, b) => a + b.points, 0)
            + payload.reduce((a, b) => a + b.points, 0)
      }
    },
    setSortedSlots(state, action: PayloadAction<AuctionSlot[]>) {
      const payload = action.payload

      state.sortedSlots = payload
    },
    setSlotsSortOptions(state, action: PayloadAction<SortingOptions<AuctionSlot>>) {
      state.sortingOptions = action.payload
    },
    setPointsSum(state, action: PayloadAction<number>) {
      state.slotsPointsSum = action.payload
    },
  },
  selectors: {
    getSlots(state) {
      return state.slots
    },
    getDropoutSlots(state) {
      return state.dropoutSlots
    },
    getSlotsPointsSum(state) {
      return state.slotsPointsSum
    },
    getSlotsSortOptions: (state) => {
      return state.sortingOptions
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAuctionSlotsThunk.fulfilled, (state, action) => {
      const { payload: auctionSlots } = action

      if (!auctionSlots)
        return

      const pointsSum = auctionSlots.reduce((acc, slot) => {
        acc += slot.points

        return acc
      }, 0)

      state.slots = [...auctionSlots]
      state.slotsPointsSum = pointsSum
    })
  },
})

export const {
  actions: auctionSlotsActions,
  reducer: auctionSlotsReducer,
  selectors: auctionSlotsSelectors,
} = slice
