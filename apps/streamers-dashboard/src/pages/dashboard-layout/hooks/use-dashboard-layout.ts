import { useCallback, useEffect, useRef } from 'react'

import type { Auction } from '~entities/auction/model'

import { useAppSSE } from '~shared/hooks'

export type useDashboardLayoutReturn = {
  isSSEConnected: boolean
  isPending: boolean
}

export const useDashboardLayout = (auctionUUID: Auction['auctionUUID']): useDashboardLayoutReturn => {
  const { isAllEventsConnected, connectToSSEEvents, isPending, isTabLeader } = useAppSSE()

  const isTabInitAsLeaderRef = useRef(isTabLeader)

  const connectToSSE = useCallback(async (auctionUUID: string) => {
    await connectToSSEEvents(auctionUUID)
  }, [connectToSSEEvents])

  useEffect(() => {
    const isTabBecomeLeader = !isTabInitAsLeaderRef.current && isTabLeader

    if (isTabBecomeLeader && !isPending) {
      isTabInitAsLeaderRef.current = true

      connectToSSE(auctionUUID)
    }
  }, [
    isPending,
    isAllEventsConnected,
    auctionUUID,
    isTabLeader,
    connectToSSE,
  ])

  useEffect(() => {
    if (isAllEventsConnected || isPending || !isTabLeader)
      return

    connectToSSE(auctionUUID)
  }, [
    isPending,
    isTabLeader,
    connectToSSE,
    isAllEventsConnected,
    auctionUUID,
  ])

  return { isSSEConnected: isAllEventsConnected, isPending }
}
