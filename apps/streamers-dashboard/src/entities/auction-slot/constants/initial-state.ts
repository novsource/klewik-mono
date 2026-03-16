import type { AuctionSlot } from '../model'

import type { SortingOptions } from '~shared/store/model'

// const fakeAuctionSlots = createFakeAuctionSlotsArray({ minLength: 50, maxLength: 130 })

// const slotsPointsSum = fakeAuctionSlots.reduce(
//   (sum, slot) => sum + slot.points,
//   0,
// )

export type AuctionSlotsSliceState = {
  slots: AuctionSlot[]
  alivedSlotsIds: number[]
  droppedSlotsIds: number[]
  sortedSlots: AuctionSlot[]
  slotsPointsSum: number
  sortingOptions: SortingOptions<AuctionSlot>
}

export const AUCTION_SLOTS_SLICE_INITIAL_STATE: AuctionSlotsSliceState = {
  slots: [],
  alivedSlotsIds: [],
  sortedSlots: [],
  droppedSlotsIds: [],
  slotsPointsSum: 0,
  sortingOptions: {
    field: 'points',
    type: 'descending',
  },
}
