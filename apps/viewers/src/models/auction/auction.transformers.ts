import { Auction, AuctionDTO } from "./auction.types";

export const transformAuctionDTO = (dto: AuctionDTO): Auction => {
  const {
    dropoutSlotsIds, slotsIds, auctionUUID: uuid, processedDonationsIds, ...restAuctionData } = dto

  return { ...restAuctionData, uuid }
}
