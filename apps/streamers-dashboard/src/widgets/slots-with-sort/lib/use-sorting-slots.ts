import { useEffect, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { deleteAllSpacesFromString } from '~shared/utils/string-format'

type SortingTypes = 'ascending' | 'descending'

export type SortingSlotsOptions = {
  field: keyof AuctionSlot
  type: SortingTypes
}

const compareSlotsFields = (
  slotOne: AuctionSlot,
  slotTwo: AuctionSlot,
  options: SortingSlotsOptions
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
  options: SortingSlotsOptions
) => {
  const [sortedSlots, setSortedSlots] = useState(() => slots)

  useEffect(() => {
    setSortedSlots(() =>
      [...slots].sort((itemOne, itemTwo) =>
        compareSlotsFields(itemOne, itemTwo, options)
      )
    )
  }, [options.field, options.type, slots])

  return sortedSlots
}

export { useSortingSlots }
