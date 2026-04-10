import type { AuctionSlot } from '../model'

export type AuctionSlotsSliceState = {
  slots: AuctionSlot[]
  sortedSlots: AuctionSlot[]
  slotsPointsSum: number
}

export const AUCTION_SLOTS_SLICE_INITIAL_STATE: AuctionSlotsSliceState = {
  slots: [],
  sortedSlots: [],
  slotsPointsSum: 0,
}
