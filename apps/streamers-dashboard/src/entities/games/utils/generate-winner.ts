import type { AuctionSlot } from '~entities/auction-slot/model/@x/auction-slot'

export function generateWinner(slots: AuctionSlot[]) {
  const winner = getWeightedRandomSlot(slots)

  return winner
}

function getWeightedRandomSlot(slots: AuctionSlot[]) {
  if (slots.length === 0)
    return null

  let cumulativeSum = 0
  const cumulative: number[] = []

  for (const slot of slots) {
    cumulativeSum += slot.points
    cumulative.push(cumulativeSum)
  }

  if (cumulativeSum === 0)
    return null

  const rand = Math.random() * cumulativeSum

  let low = 0
  let high = cumulative.length - 1

  while (low < high) {
    const mid = (low + high) >> 1

    if (cumulative[mid] <= rand)
      low = mid + 1
    else
      high = mid
  }

  return slots[low]
}
