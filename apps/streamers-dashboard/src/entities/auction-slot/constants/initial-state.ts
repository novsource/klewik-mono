import type { AuctionSlotsSliceState } from '../store'

import { faker } from '@faker-js/faker'

import { getHEXColor } from '~shared/utils'

const mockedAuctionSlots = Array.from({ length: faker.number.int({ min: 50, max: 120 }) })
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    title: faker.word.words(10),
    auctionSlotOrder: index + 1,
    points: faker.number.int({ min: 200, max: 205000 }),
    color: getHEXColor(),
  }))

const slotsPointsSum = mockedAuctionSlots.reduce(
  (sum, slot) => sum + slot.points,
  0,
)

export const AUCTION_SLOTS_SLICE_INITIAL_STATE: AuctionSlotsSliceState = {
  slots: import.meta.env.DEV ? mockedAuctionSlots : [],
  sortedSlots: [],
  dropoutSlots: [],
  slotsPointsSum: import.meta.env.DEV ? slotsPointsSum : 0,
  sortingOptions: {
    field: 'points',
    type: 'descending',
  },
}
