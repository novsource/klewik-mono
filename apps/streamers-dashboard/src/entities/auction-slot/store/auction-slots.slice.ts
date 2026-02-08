import type { PayloadAction } from '@reduxjs/toolkit'

import type { AuctionSlot } from '../model'

import { createSlice } from '@reduxjs/toolkit'

import type { AuctionSlotsDTO } from '~shared/api/http/auction-slots'

import type { SortingOptions } from '~shared/store/model'

import { getAuctionSlotsThunk } from '../api'
import { AUCTION_SLOTS_SLICE_INITIAL_STATE as initialState } from '../constants'

export type AuctionSlotsSliceState = {
  slots: AuctionSlot[]
  alivedSlots: AuctionSlot[]
  dropoutSlots: AuctionSlot[]
  sortedSlots: AuctionSlot[]
  slotsPointsSum: number
  sortingOptions: SortingOptions<AuctionSlot>
}

const slice = createSlice({
  name: 'auctionSlots',
  initialState,
  reducers: {
    addSlots(state, action: PayloadAction<AuctionSlotsDTO[]>) {
      const payload = action.payload

      const filtredSlots = state.slots.filter(
        slot => !payload.find(item => slot.id === item.id),
      )

      const addedPoints = payload.reduce((sum, slot) => sum + slot.points, 0)

      const slotsWithWinPercents = payload.map((slot) => {
        return { ...slot, winPercents: (slot.points / (state.slotsPointsSum + addedPoints)) * 100 }
      })

      state.slots = [...filtredSlots, ...slotsWithWinPercents]
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

      state.slots = state.slots.reduce((acc, slot) => {
        if (slot.id === id) {
          acc.push({ ...slot, ...data })
        }
        else {
          acc.push(slot)
        }

        return acc
      }, [] as AuctionSlot[])
    },
    updateSlots(state, action: PayloadAction<AuctionSlot[]>) {
      state.slots = state.slots.reduce((acc, slot) => {
        const updatedSlotData = action.payload.find(item => item.id === slot.id)

        if (!updatedSlotData) {
          acc.push(slot)
        }
        else {
          acc.push({ ...slot, ...updatedSlotData })
        }

        return acc
      }, [] as typeof state.slots)
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
    getAlivedSlots(state) {
      return state.alivedSlots
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
      const { payload: fetchedSlots } = action

      if (!fetchedSlots)
        return

      const fetchedSlotsPointsSum = fetchedSlots.reduce((sum, slot) => {
        sum += slot.points

        return sum
      }, 0)

      const updatedPointsSum = state.slotsPointsSum + fetchedSlotsPointsSum
      const updatedAuctionSlots = [...fetchedSlots, ...state.slots].map<AuctionSlot>((slot) => {
        const winPercents = (slot.points / updatedPointsSum) * 100

        return { ...slot, winPercents }
      })

      state.slots = updatedAuctionSlots
      state.slotsPointsSum = updatedPointsSum
    })
  },
})

export const {
  actions: auctionSlotsActions,
  reducer: auctionSlotsReducer,
  selectors: auctionSlotsSelectors,
} = slice
