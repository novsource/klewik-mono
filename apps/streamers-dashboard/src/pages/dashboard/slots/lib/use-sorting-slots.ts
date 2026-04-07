import { useEffect, useMemo } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions } from '~entities/auction-slot/store'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import type { SortingOptions } from '~shared/store/model'

import { deleteAllSpacesFromString } from '~shared/utils/formatting'

import { useSlotsPageContext } from '../context/slots-page.context'

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
  if (typeof slotOne[field] === 'number' && typeof slotTwo[field] === 'number') {
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

export const useSortingSlots = (slots: AuctionSlot[], options?: SortingOptions<AuctionSlot>) => {
  const { state: { sortingSlotsOptions } } = useSlotsPageContext()

  const { setSortedSlots } = useActionCreators(auctionSlotsActions)

  const sortedSlots = useMemo(() => {
    const sortingOptions = options ?? sortingSlotsOptions

    if (sortingOptions === null)
      return slots

    return [...slots].sort((slotOne, slotTwo) =>
      compareSlotsFields(slotOne, slotTwo, sortingOptions),
    )
  }, [slots, options, sortingSlotsOptions])

  useEffect(() => {
    setSortedSlots(sortedSlots)
  }, [sortedSlots])

  return sortedSlots
}
