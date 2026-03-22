export type AuctionDTO = {
  id: number
  auctionUUID: string
  ownerId: string
  wheelMode: 'classic' | 'dropout'
  processedDonationsIds: number[],
  slotsIds: number[],
  dropoutSlotsIds: number[],
  winnerSlotId: number | null
  isBetsClosed: boolean
  isEnded: boolean
  createdAt: string
  endedAt: string
}

export type Auction = {
  id: number
  uuid: string
  ownerId: string
  winnerSlotId: number | null
  wheelMode: 'classic' | 'dropout'
  isBetsClosed: boolean
  isEnded: boolean
  createdAt: string
  endedAt: string
}
