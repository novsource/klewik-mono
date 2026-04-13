import type { AuctionGameMode } from '~entities/games/model'

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
    const temp = sortedLots[left].points
    sortedLots[left].points = sortedLots[right].points
    sortedLots[right].points = temp

    left++
    right--
  }

  return clonedSlots.map((slot) => {
    const findedSlot = sortedLots.find(item => item.id === slot.id)

    if (findedSlot) {
      slot.points = findedSlot.points
    }

    return slot
  })
}

export const transformSlotsToGameMode = (auctionSlots: AuctionSlot[], mode: AuctionGameMode) => {
  if (mode === 'classic')
    return auctionSlots

  const sortedSlots = [...auctionSlots].sort((a, b) => b.points - a.points)

  let left = 0
  let right = auctionSlots.length - 1

  // reverse
  while (left <= right) {
    const temp = sortedSlots[left].points
    sortedSlots[left].points = sortedSlots[right].points
    sortedSlots[right].points = temp

    left++
    right--
  }

  console.log('sorted', auctionSlots, sortedSlots)

  return auctionSlots.map<AuctionSlot>((slot) => {
    const findedSlot = sortedSlots.find(item => item.id === slot.id)

    if (findedSlot) {
      return { ...slot, points: findedSlot.points }
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
