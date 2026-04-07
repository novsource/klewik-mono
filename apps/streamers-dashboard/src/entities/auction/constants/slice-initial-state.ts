import type { AuctionSliceState } from '../store/auction.slice'

export const AUCTION_SLICE_INITIAL_STATE: AuctionSliceState = {
  type: null,
  info: {
    id: 0,
    uuid: '',
    ownerId: '',
    createdAt: '',
    endedAt: null,
    winnerSlotId: null,
    isBetsClosed: false,
    isEnded: false,
  },
}
