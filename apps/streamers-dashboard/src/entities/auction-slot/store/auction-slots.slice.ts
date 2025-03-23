import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { z } from 'zod'

import { HexColorSchema } from '~shared/lib/zod'

import { getHEXColor } from '~shared/utils/colors'

import { AuctionSlot } from '../model'

type AuctionSlotsState = {
  slots: AuctionSlot[]
  dropoutSlots: AuctionSlot[]
  sortedSlots: AuctionSlot[]
  slotsPointsSum: number
}

const mockedAuctionSlots = Array(30)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    name: `Бэтмен ${index}`,
    points: Math.floor(Math.random() * 10000),
    color: getHEXColor() as z.infer<typeof HexColorSchema>,
  }))

const slotsPointsSum = mockedAuctionSlots.reduce(
  (sum, slot) => sum + slot.points,
  0
)

const initialState: AuctionSlotsState = {
  slots: mockedAuctionSlots,
  sortedSlots: mockedAuctionSlots,
  dropoutSlots: import.meta.env.VITE_DEV ? mockedAuctionSlots : [],
  slotsPointsSum: import.meta.env.VITE_DEV ? slotsPointsSum : 0,
}

const slice = createSlice({
  name: 'auctionSlots',
  initialState,
  reducers: {
    addSlots(state, action: PayloadAction<AuctionSlot[]>) {
      const payload = action.payload

      const filtredSlots = state.slots.filter(
        (slot) => !payload.find((item) => slot.id === item.id)
      )

      state.slots = [...filtredSlots, ...payload]
    },
    updateSlot(
      state,
      action: PayloadAction<{
        id: AuctionSlot['id']
        data: Partial<Omit<AuctionSlot, 'id'>>
      }>
    ) {
      const id = action.payload.id
      const data = action.payload.data

      const updatedSlot = state.slots.find((slot) => id === slot.id)

      if (!updatedSlot) return

      updatedSlot.name = data.name ?? updatedSlot.name
      updatedSlot.color = data.color ?? updatedSlot.color
      updatedSlot.points = data.points ?? updatedSlot.points
    },
    deleteSlot(state, action: PayloadAction<{ id: AuctionSlot['id'] }>) {
      const payload = action.payload

      state.slots = state.slots.filter((slot) => slot.id !== payload.id)
    },
    updateSlotsPointsSum(
      state,
      action: PayloadAction<Omit<AuctionSlot, 'color' | 'name'>[]>
    ) {
      const payload = action.payload

      const filtredSlots = state.slots.filter(
        (slot) => !payload.find((item) => slot.id === item.id)
      )

      if (filtredSlots.length === state.slots.length) {
        state.slotsPointsSum += payload.reduce((a, slot) => a + slot.points, 0)
      } else {
        state.slotsPointsSum =
          filtredSlots.reduce((a, b) => a + b.points, 0) +
          payload.reduce((a, b) => a + b.points, 0)
      }
    },
    setSortedSlots(state, action: PayloadAction<AuctionSlot[]>) {
      const payload = action.payload

      state.sortedSlots = payload
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
  },
})

const {
  actions: auctionSlotsActions,
  reducer: auctionSlotsReducer,
  selectors: auctionSlotsSelectors,
} = slice

export { auctionSlotsActions, auctionSlotsSelectors, auctionSlotsReducer }
