import { useMemo, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { SlotsSortingOptions } from '~shared/store/model'
import { deleteAllSpacesFromString } from '~shared/utils/string-format'

const compareSlotsFields = (
  slotOne: AuctionSlot,
  slotTwo: AuctionSlot,
  options: SlotsSortingOptions<AuctionSlot>,
) => {
  const field = options.field as keyof AuctionSlot
  const type = options.type

  let diff = 0

  if (typeof slotOne[field] === 'string') {
    const slotOneNameFormatted = deleteAllSpacesFromString(slotOne.title.trim())
    const slotTwoNameFormatted = deleteAllSpacesFromString(slotTwo.title.trim())

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
  options: SlotsSortingOptions<AuctionSlot>,
) => {
  const [sortingOptions, setSortingOptions] = useState<NullablePossible<SlotsSortingOptions<AuctionSlot>>>(null)

  if (sortingOptions !== options) {
    setSortingOptions(options)
  }

  const sortedSlots = useMemo(() => {
    if (sortingOptions === null)
      return slots

    return [...slots].sort((itemOne, itemTwo) =>
      compareSlotsFields(itemOne, itemTwo, sortingOptions),
    )
  }, [slots, sortingOptions])

  return sortedSlots
}

export { useSortingSlots }
