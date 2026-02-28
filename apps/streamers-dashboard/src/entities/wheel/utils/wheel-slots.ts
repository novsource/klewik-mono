import type { WheelSlot } from '../model'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { convertDegreesToRadians } from '~shared/utils/common'

export const formatSlotsToDropoutMode = (slots: AuctionSlot[]) => {
  const clonedSlots = structuredClone(slots)

  const sortedLots = clonedSlots
    .map(slot => ({ ...slot }))
    .sort((a, b) => a.points - b.points)

  let left = 0
  let right = slots.length - 1

  while (left <= right) {
    const buffer = sortedLots[left].points
    sortedLots[left].points = sortedLots[right].points
    sortedLots[right].points = buffer

    left++
    right--
  }

  return clonedSlots.map((slot) => {
    const findingLot = sortedLots.find(item => item.id === slot.id)

    if (findingLot) {
      slot.points = findingLot.points
    }

    return { ...slot }
  })
}

export const generateWinner = (slots: WheelSlot[]): WheelSlot => {
  const winnerRadians = 2 * Math.PI * Math.random()

  for (const slot of slots) {
    const { startAngle, endAngle } = slot

    const startAngleInRadians = convertDegreesToRadians(startAngle)
    const endAngleInRadians = convertDegreesToRadians(endAngle)

    if (
      winnerRadians >= startAngleInRadians
      && endAngleInRadians >= winnerRadians
    ) {
      return slot
    }
  }

  return slots[0]
}
