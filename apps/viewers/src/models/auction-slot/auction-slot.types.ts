export type AuctionSlotDTO = {
  id: number,
  auctionSlotOrder: number,
  title: string,
  points: number,
  isAlived: boolean,
  isDropped: boolean,
}

export type AuctionSlot = {
  id: number,
  auctionSlotOrder: number,
  title: string,
  points: number,
  winPercents: number,
  isAlived: boolean,
  isDropped: boolean,
}
