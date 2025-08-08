import { useMemo } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import type { SortingOptions } from '~shared/store/model'

import { deleteAllSpacesFromString } from '~shared/utils/string-format'

const compareSlotsFields = (
  slotOne: AuctionSlot,
  slotTwo: AuctionSlot,
  options: SortingOptions<AuctionSlot>,
) => {
  const field = options.field
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

const useSortingSlots = (slots: AuctionSlot[], options?: SortingOptions<AuctionSlot>) => {
  const storeSortingOptions = useStoreSelector(auctionSlotsSelectors.getSlotsSortOptions)

  const sortingOptions = options ?? storeSortingOptions

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
