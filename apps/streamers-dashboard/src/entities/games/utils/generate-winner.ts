import type { AuctionSlot } from '~entities/auction-slot/model/@x/auction-slot'

export function generateWinner(slots: AuctionSlot[]) {
  const winner = getWeightedRandomSlot(slots)

  return winner
}

function getWeightedSlots(slots: AuctionSlot[]) {
  const totalPoints = slots.reduce((sum, slot) => sum + slot.points, 0)
  if (totalPoints === 0)
    return []

  let cumulativeSum = 0
  const cumulative = slots.reduce<number[]>((acc, slot) => {
    cumulativeSum += slot.points
    acc.push(cumulativeSum)

    return acc
  }, [])

  return cumulative
}

function getWeightedRandomSlot(slots: AuctionSlot[]) {
  const totalPoints = slots.reduce((sum, slot) => sum + slot.points, 0)
  if (totalPoints === 0)
    return null

  const weightedSlots = getWeightedSlots(slots)

  // Генерируем случайный вес
  const rand = Math.random() * totalPoints

  // Бинарный поиск для нахождения индекса слота
  let low = 0
  let high = weightedSlots.length - 1

  while (low < high) {
    const mid = Math.floor((low + high) / 2)

    if (weightedSlots[mid] <= rand) {
      low = mid + 1
    }
    else {
      high = mid
    }
  }

  return slots[low]
}
