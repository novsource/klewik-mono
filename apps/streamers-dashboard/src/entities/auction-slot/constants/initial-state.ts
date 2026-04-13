import type { AuctionSlot } from '../model'

import { createFakeAuctionSlotsArray } from '../model/__tests__/auction-slot.mocks'

export type AuctionSlotsSliceState = {
  slots: AuctionSlot[]
  sortedSlots: AuctionSlot[]
  slotsPointsSum: number
}

export const AUCTION_SLOTS_SLICE_INITIAL_STATE: AuctionSlotsSliceState = {
  slots: import.meta.env.DEV ? createFakeAuctionSlotsArray({ minLength: 600, maxLength: 800 }) : [],
  sortedSlots: [],
  slotsPointsSum: 0,
}
