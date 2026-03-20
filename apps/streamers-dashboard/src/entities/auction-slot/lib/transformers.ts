import type { AuctionSlot } from '../model'

import type { AuctionSlotsDTO } from '~shared/api/http/auction-slots'

import { getPercentValue } from '~shared/utils/common'

export function transformAuctionSlotDTO(slot: AuctionSlotsDTO, pointsSum: number): AuctionSlot
export function transformAuctionSlotDTO(slot: AuctionSlotsDTO, allSlots: AuctionSlot[]): AuctionSlot
export function transformAuctionSlotDTO(slot: AuctionSlotsDTO, arg: AuctionSlot[] | number): AuctionSlot {
  const currentSlotsPointsSum = typeof arg === 'number' ? arg : arg.reduce((acc, curr) => acc + curr.points, 0)

  const updatedSlotsPointsSum = currentSlotsPointsSum + slot.points

  return { ...slot, winPercents: getPercentValue(updatedSlotsPointsSum, slot.points) }
}
