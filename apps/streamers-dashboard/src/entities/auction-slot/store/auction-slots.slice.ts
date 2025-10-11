import type { PayloadAction } from '@reduxjs/toolkit'

import type { AuctionSlot } from '../model'

import { createSlice } from '@reduxjs/toolkit'

import type { SortingOptions } from '~shared/store/model'

import { getRandomHEXColor } from '~shared/utils'

import { getAuctionSlotsThunk } from '../api'

type AuctionSlotsState = {
  slots: AuctionSlot[]
  dropoutSlots: AuctionSlot[]
  sortedSlots: AuctionSlot[]
  slotsPointsSum: number
  sortingOptions: SortingOptions<AuctionSlot>
}

// const mockedAuctionSlots = Array.from({ length: faker.number.int({ min: 40, max: 140 }) })
//   .fill(null)
//   .map((_, index) => ({
//     id: index + 1,
//     title: faker.word.words(10),
//     points: faker.number.int({ min: 200, max: 205000 }),
//     color: getHEXColor() as z.infer<typeof HexColorSchema>,
//   }))

// const slotsPointsSum = mockedAuctionSlots.reduce(
//   (sum, slot) => sum + slot.points,
//   0,
// )

const initialState: AuctionSlotsState = {
  slots: [],
  sortedSlots: [],
  dropoutSlots: import.meta.env.VITE_DEV ? [] : [],
  slotsPointsSum: import.meta.env.VITE_DEV ? 0 : 0,
  sortingOptions: {
    field: 'points',
    type: 'descending',
  },
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
      updatedSlot.color = data.color ?? updatedSlot.color
      updatedSlot.points = data.points ?? updatedSlot.points
    },
    deleteSlot(state, action: PayloadAction<{ id: AuctionSlot['id'] }>) {
      const payload = action.payload

      state.slots = state.slots.filter(slot => slot.id !== payload.id)
    },
    updateSlotsPointsSum(
      state,
      action: PayloadAction<Omit<AuctionSlot, 'color' | 'title'>[]>,
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

      const slotsWithColors = auctionSlots.reduce<AuctionSlot[]>((acc, slot) => {
        const slotWithColor: AuctionSlot = { ...slot, color: getRandomHEXColor() }

        acc.push(slotWithColor)
        return acc
      }, [])

      state.slots = slotsWithColors
    })
  },
})

export const {
  actions: auctionSlotsActions,
  reducer: auctionSlotsReducer,
  selectors: auctionSlotsSelectors,
} = slice
