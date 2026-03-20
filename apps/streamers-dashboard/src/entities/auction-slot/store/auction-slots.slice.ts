import type { PayloadAction } from '@reduxjs/toolkit'

import type { AuctionSlot } from '../model'

import { createSlice } from '@reduxjs/toolkit'

import type { AuctionSlotsDTO } from '~shared/api/http/auction-slots'

import type { SortingOptions } from '~shared/store/model'

import { getPercentValue } from '~shared/utils/common'

import { getAuctionSlotsThunk } from '../api'
import { AUCTION_SLOTS_SLICE_INITIAL_STATE as initialState } from '../constants'
import { transformAuctionSlotDTO } from '../lib'

type UpdateAlivedSlotsActionPayload = {
  data: number[]
  mode: 'add' | 'delete'
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
    updateAlivedSlotsIds(state, action: PayloadAction<UpdateAlivedSlotsActionPayload>) {
      const { mode, data } = action.payload

      if (data.length === 0)
        return

      switch (mode) {
        case 'add': {
          state.alivedSlotsIds = [...state.alivedSlotsIds.filter(id => !data.includes(id)), ...data]

          break
        }
        case 'delete': {
          const deletedSlotsIdsCollection = new Set(data)

          state.alivedSlotsIds = state.alivedSlotsIds.filter(slot => deletedSlotsIdsCollection.has(slot))
        }
      }
    },
    updateDroppedSlotsIds(state, action: PayloadAction<UpdateAlivedSlotsActionPayload>) {
      const { mode, data } = action.payload

      if (data.length === 0)
        return

      switch (mode) {
        case 'add': {
          state.droppedSlotsIds = [...state.droppedSlotsIds.filter(id => !data.includes(id)), ...data]

          break
        }
        case 'delete': {
          const deletedSlotsIdsCollection = new Set(data)

          state.droppedSlotsIds = state.droppedSlotsIds.filter(slot => deletedSlotsIdsCollection.has(slot))
        }
      }
    },
    // updateDroppedSlots(state, action: PayloadAction<UpdateAlivedSlotsActionPayload>) {
    // const { mode, data } = action.payload

    // if (Array.isArray(data) && data.length === 0)
    //   return

    // switch (mode) {
    //   case 'update': {
    //     const updatedSlotsCollection = new Set(Array.isArray(data) ? data : [data])

    //     const updatedSlots = state.dropoutSlots.filter((slot) => {
    //       const isShouldBeUpdated = updatedSlotsCollection.has(slot)

    //       if (!isShouldBeUpdated)
    //         return false

    //       updatedSlotsCollection.delete(slot)
    //       return true
    //     })

    //     state.dropoutSlots = [...state.dropoutSlots, ...updatedSlots, ...updatedSlotsCollection.values()]

    //     break
    //   }
    //   case 'delete': {
    //     const deletedSlotsCollection = new Set(Array.isArray(data) ? data : [data])

    //     state.dropoutSlots = state.dropoutSlots.filter(slot => deletedSlotsCollection.has(slot))
    //   }
    // }
    // },
    // updateAlivedSlots(state, action: PayloadAction<UpdateAlivedSlotsActionPayload>) {
    //   const { mode, data } = action.payload

    //   if (Array.isArray(data) && data.length === 0)
    //     return

    //   switch (mode) {
    //     case 'update': {
    //       const updatedSlotsCollection = new Set(Array.isArray(data) ? data : [data])

    //       const updatedSlots = state.alivedSlots.filter((slot) => {
    //         const isShouldBeUpdated = updatedSlotsCollection.has(slot)

    //         if (!isShouldBeUpdated)
    //           return false

    //         updatedSlotsCollection.delete(slot)
    //         return true
    //       })

    //       state.alivedSlots = [...state.alivedSlots, ...updatedSlots, ...updatedSlotsCollection.values()]

    //       break
    //     }
    //     case 'delete': {
    //       const deletedSlotsCollection = new Set(Array.isArray(data) ? data : [data])

    //       state.alivedSlots = state.alivedSlots.filter(slot => deletedSlotsCollection.has(slot))
    //     }
    //   }
    // },
    setSlots(state, action: PayloadAction<AuctionSlotsDTO[]>) {
      const transformedSlots = action.payload.map(slot => transformAuctionSlotDTO(slot, state.slotsPointsSum))

      state.slots = transformedSlots
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
    getAlivedSlotsIds(state) {
      return state.alivedSlotsIds
    },
    getDroppedSlotsIds(state) {
      return state.droppedSlotsIds
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
