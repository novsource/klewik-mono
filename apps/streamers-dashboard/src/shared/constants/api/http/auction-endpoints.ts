export const AUCTION_ENDPOINTS = {
  CREATE: `${import.meta.env.VITE_SERVER_API_PREFIX}/auction/create`,
  GET_AUCTION: (auctionUUID: string) => `${import.meta.env.VITE_SERVER_API_PREFIX}/auctions/${auctionUUID}`,
} as const
