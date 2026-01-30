import { useCallback, useEffect, useRef } from 'react'

import type { Auction } from '~entities/auction/model'

import { donationsActions } from '~entities/donation/store'

import { useAppSSE, useDonationsSSE, useTabLeader } from '~shared/hooks'

import { useActionCreators } from '~shared/lib/redux-toolkit'

export type useDashboardLayoutReturn = {
  isSSEConnected: boolean
  isPending: boolean
}

export const useDashboardLayout = (auctionUUID: Auction['auctionUUID']): useDashboardLayoutReturn => {
  const { isPending, isSSEConnected } = useConnectToDashboardSSEEvents(auctionUUID)

  const { addDonation, updateDonationsStatusesCounts } = useActionCreators(donationsActions)

  useDonationsSSE({
    'donations/add': (donation) => {
      addDonation(donation)
      updateDonationsStatusesCounts({ [donation.processData.status]: 1 })
    },
  })

  return { isPending, isSSEConnected }
}

function useConnectToDashboardSSEEvents(auctionUUID: string) {
  const { isAllEventsConnected, connectToSSEEvents, isPending } = useAppSSE()
  const { isTabLeader } = useTabLeader()

  const isTabInitAsLeaderRef = useRef(isTabLeader)
  const isShouldConnectRef = useRef(true)

  console.log(isTabInitAsLeaderRef.current)

  const connectToSSE = useCallback(async (auctionUUID: string) => {
    try {
      await connectToSSEEvents(auctionUUID)

      isShouldConnectRef.current = false
    }
    catch (error) {
      console.log(error)
    }
  }, [connectToSSEEvents])

  useEffect(() => {
    const isTabBecomeLeader = !isTabInitAsLeaderRef.current && isTabLeader
    console.log(isTabBecomeLeader)

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
    if (isAllEventsConnected || isPending || !isTabLeader || !isShouldConnectRef.current)
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
