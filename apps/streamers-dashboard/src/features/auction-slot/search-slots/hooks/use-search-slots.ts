import { useMemo, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { removeSpaceDuplicatingFromString } from '~shared/utils/formatting'

const useSearchAuctionSlots = (
  searchValue: string,
  slots?: AuctionSlot[],
): AuctionSlot[] => {
  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const [searchedSlots, setSearchedSlots] = useState(slots ?? storedAuctionSlots)

  const cleanSearchValue = useMemo(() => {
    return removeSpaceDuplicatingFromString(searchValue.trim())
  }, [searchValue])

  const filtredSlots = useMemo(() => {
    if (cleanSearchValue.length === 0)
      return []

    return (slots ?? storedAuctionSlots).filter(slot =>
      slot.title.toLowerCase().includes(cleanSearchValue.toLowerCase()),
    )
  }, [slots, cleanSearchValue, storedAuctionSlots])

  if (searchedSlots !== filtredSlots) {
    setSearchedSlots(filtredSlots)
  }

  return searchedSlots
}

export { useSearchAuctionSlots }
