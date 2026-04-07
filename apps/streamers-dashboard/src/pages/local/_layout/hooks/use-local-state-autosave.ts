import { useEffect, useRef } from 'react'

import { useAuctionSlotsIDB } from '~entities/auction-slot/hooks'
import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useUnmount } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

export const useLocalStateAutosave = () => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const auctionSlotsIDB = useAuctionSlotsIDB()

  const updateTimerRef = useRef<NullablePossible<NodeJS.Timeout>>(null)

  useEffect(() => {
    if (!auctionSlotsIDB.isOpened) {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current)
      }
    }

    const refreshStaleData = async (slots: AuctionSlot[]) => {
      await auctionSlotsIDB.deleteAll()
      await auctionSlotsIDB.put(slots)
    }

    updateTimerRef.current = setTimeout(() => refreshStaleData(auctionSlots))

    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current)
      }
    }
  }, [auctionSlots, auctionSlotsIDB.isOpened])

  useUnmount(() => {
    if (updateTimerRef.current)
      clearTimeout(updateTimerRef.current)
  })
}
