import type { AuctionSlotsSliceState } from '../store'

// const fakeAuctionSlots = createFakeAuctionSlotsArray({ minLength: 50, maxLength: 130 })

// const slotsPointsSum = fakeAuctionSlots.reduce(
//   (sum, slot) => sum + slot.points,
//   0,
// )

export const AUCTION_SLOTS_SLICE_INITIAL_STATE: AuctionSlotsSliceState = {
  slots: [],
  alivedSlots: [],
  sortedSlots: [],
  dropoutSlots: [],
  slotsPointsSum: 0,
  sortingOptions: {
    field: 'points',
    type: 'descending',
  },
}
