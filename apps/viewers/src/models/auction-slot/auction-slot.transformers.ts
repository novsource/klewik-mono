import { AuctionSlot, AuctionSlotDTO } from "./auction-slot.types";

export const transformAuctionSlotDTO = (dto: AuctionSlotDTO, pointsSum: number): AuctionSlot => {
  const winPercents = (dto.points / pointsSum) * 100;

  return { ...dto, winPercents }
}
