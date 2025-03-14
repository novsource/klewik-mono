import { useLayoutEffect, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { SlotsSortingOptions } from '~shared/store/model'

import { deleteAllSpacesFromString } from '~shared/utils/string-format'

const compareSlotsFields = (
  slotOne: AuctionSlot,
  slotTwo: AuctionSlot,
  options: SlotsSortingOptions
) => {
  const field = options.field as keyof AuctionSlot
  const type = options.type

  let diff = 0

  if (typeof slotOne[field] === 'string') {
    const slotOneNameFormatted = deleteAllSpacesFromString(slotOne.name.trim())
    const slotTwoNameFormatted = deleteAllSpacesFromString(slotTwo.name.trim())

    diff = slotOneNameFormatted.localeCompare(slotTwoNameFormatted, undefined, {
      sensitivity: 'base',
    })
  }
  if (typeof slotOne[field] === 'number') {
    diff = slotOne[field] - slotTwo[field]
  }

  if (diff > 0) {
    return type === 'ascending' ? 1 : -1
  }

  if (diff < 0) {
    return type === 'descending' ? 1 : -1
  }

  return 0
}

const useSortingSlots = (
  slots: AuctionSlot[],
  options: SlotsSortingOptions
) => {
  const [sortedSlots, setSortedSlots] = useState(() => slots)

  useLayoutEffect(() => {
    setSortedSlots(() =>
      [...slots].sort((itemOne, itemTwo) =>
        compareSlotsFields(itemOne, itemTwo, options)
      )
    )
  }, [options.field, options.type, slots])

  return sortedSlots
}

export { useSortingSlots }
