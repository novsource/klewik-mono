import type { AuctionSlot } from '../model'

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
}

export const AUCTION_SLOTS_SLICE_INITIAL_STATE: AuctionSlotsSliceState = {
  slots: [],
  alivedSlotsIds: [],
  sortedSlots: [],
  droppedSlotsIds: [],
  slotsPointsSum: 0,
}
