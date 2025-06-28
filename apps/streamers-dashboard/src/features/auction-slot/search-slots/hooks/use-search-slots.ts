import { useMemo, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { removeSpaceDuplicatingFromString } from '~shared/utils/string-format'

const useSearchAuctionSlots = (
  searchValue: string,
  slots: AuctionSlot[],
): AuctionSlot[] => {
  const [searchedSlots, setSearchedSlots] = useState(() => slots)

  const cleanSearchValue = useMemo(() => {
    return removeSpaceDuplicatingFromString(searchValue.trim())
  }, [searchValue])

  const filtredSlots = useMemo(() => {
    if (cleanSearchValue.length === 0)
      return slots

    return slots.filter(slot =>
      slot.title.toLowerCase().includes(cleanSearchValue.toLowerCase()),
    )
  }, [slots, cleanSearchValue])

  if (searchedSlots !== filtredSlots) {
    setSearchedSlots(filtredSlots)
  }

  return searchedSlots
}

export { useSearchAuctionSlots }
