import type { PayloadAction } from '@reduxjs/toolkit'

import type { AuctionSlot } from '../model'

import { createSlice } from '@reduxjs/toolkit'

import type { AuctionSlotsDTO } from '~shared/api/http/auction-slots'

import { getPercentValue } from '~shared/utils/common'

import { getAuctionSlotsThunk } from '../api'
import { AUCTION_SLOTS_SLICE_INITIAL_STATE as initialState } from '../constants'
import { transformAuctionSlotDTO } from '../lib'

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
        return { ...slot, winPercents: getPercentValue(state.slotsPointsSum + addedPoints, slot.points) * 100 }
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

      const filteredSlots = state.slots.filter(slot => slot.id !== payload.id)
      const updatedPointsSum = filteredSlots.reduce((acc, slot) => acc + slot.points, 0)

      state.slots = filteredSlots
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
    setSlots(state, action: PayloadAction<AuctionSlotsDTO[]>) {
      const transformedSlots = action.payload.map(slot => transformAuctionSlotDTO(slot, state.slotsPointsSum))

      state.slots = transformedSlots
    },
    setSortedSlots(state, action: PayloadAction<AuctionSlot[]>) {
      const payload = action.payload

      state.sortedSlots = payload
    },
    setPointsSum(state, action: PayloadAction<number>) {
      state.slotsPointsSum = action.payload
    },
  },
  selectors: {
    getSlots(state) {
      return state.slots
    },
    getSlotById(state, id: number) {
      return state.slots.find(slot => slot.id === id)
    },
    getSlotsPointsSum(state) {
      return state.slotsPointsSum
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAuctionSlotsThunk.fulfilled, (state, action) => {
      const { payload: fetchedSlots } = action

      if (!fetchedSlots)
        return

      const filteredSlots = state.slots.filter(
        slot => !fetchedSlots.find(item => slot.id === item.id),
      )

      const fetchedSlotsPointsSum = fetchedSlots.reduce((sum, slot) => sum + slot.points, 0)
      const filteredSlotsPointsSum = filteredSlots.reduce((sum, curr) => sum + curr.points, 0)
      const updatedPointsSum = filteredSlotsPointsSum + fetchedSlotsPointsSum

      const updatedAuctionSlots = [...filteredSlots, ...fetchedSlots].map<AuctionSlot>((slot) => {
        const winPercents = getPercentValue(updatedPointsSum, slot.points) * 100

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
