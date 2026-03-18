import type { AuctionSliceState } from '../store/auction.slice'

export const AUCTION_SLICE_INITIAL_STATE: AuctionSliceState = {
  info: {
    id: 0,
    uuid: '',
    ownerId: '',
    createdAt: '',
    endedAt: null,
    isBetsClosed: false,
    isEnded: false,
  },
}
