import type { AuctionSlotsSliceState } from '../store'

import { createFakeAuctionSlotsArray } from '../model/__tests__/auction-slot.mocks'

const fakeAuctionSlots = createFakeAuctionSlotsArray({ minLength: 50, maxLength: 130 })

const slotsPointsSum = fakeAuctionSlots.reduce(
  (sum, slot) => sum + slot.points,
  0,
)

export const AUCTION_SLOTS_SLICE_INITIAL_STATE: AuctionSlotsSliceState = {
  slots: import.meta.env.DEV ? fakeAuctionSlots : [],
  sortedSlots: [],
  dropoutSlots: [],
  slotsPointsSum: import.meta.env.DEV ? slotsPointsSum : 0,
  sortingOptions: {
    field: 'points',
    type: 'descending',
  },
}
