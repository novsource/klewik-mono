export const AUCTION_SLOTS_ENDPOINTS = {
  GET_SLOTS_BY_UUID: (auctionUUID: string) => `${import.meta.env.VITE_SERVER_API_PREFIX}/auctions/${auctionUUID}/slots`,
} as const
