import { useCallback, useEffect, useRef, useState } from 'react'

import { isAxiosError } from 'axios'

import { auctionSlotsSSEClient } from '~shared/api/sse/clients/auction-slots'
import type { AuctionSlotsEventsCallbacks } from '~shared/api/sse/clients/auction-slots'
import { donationsSSEClient } from '~shared/api/sse/clients/donations'
import type { DonationsSSEChannelEventsMap } from '~shared/api/sse/clients/donations'

import { BroadcastLeaderChannel } from '~shared/lib/broadcast-channel'
import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { useLazyConnectAuctionSlotsSSEQuery, useLazyConnectDonationsSSEQuery } from '~shared/store/api'
import { sseActions, sseSelectors } from '~shared/store/slices'

const mainSSEBroadcastChannel = new BroadcastLeaderChannel('mainSSEChannel')

const useDonationsSSE = (listeners?: DonationsSSEChannelEventsMap) => {
  const listenersRef = useRef(listeners)

  const isConnected = useStoreSelector(state => sseSelectors.getEventStatus(state, 'donations'))

  const { updateConnectStatus } = useActionCreators(sseActions)

  const [connectQuery, queryState] = useLazyConnectDonationsSSEQuery()

  useEffect(() => {
    if (queryState.isSuccess) {
      updateConnectStatus({ eventType: 'donations', isConnected: true })
    }
  }, [queryState.isSuccess])

  useEffect(() => {
    const unsubcribe = donationsSSEClient.onSSEEvent('onclose', () => {
      updateConnectStatus({ eventType: 'donations', isConnected: false })
    })

    return () => {
      unsubcribe()
    }
  })

  useEffect(() => {
    if (!listenersRef.current)
      return

    const unsubcribeCbArr = (Object.keys(listenersRef.current) as Array<keyof DonationsSSEChannelEventsMap>)
      .reduce<Array<() => void>>((acc, event) => {
        const eventHandler = listenersRef.current[event]
        const unsubscribe = donationsSSEClient.onEvent(event, eventHandler)

        acc.push(unsubscribe)

        return acc
      }, [])

    return () => {
      unsubcribeCbArr.forEach(unsubscribe => unsubscribe())
    }
  })

  return { isConnected, connect: connectQuery, queryState }
}

const useAuctionSlotsSSE = (listeners?: AuctionSlotsEventsCallbacks) => {
  const listenersRef = useRef(listeners)

  const isConnected = useStoreSelector(state => sseSelectors.getEventStatus(state, 'auctionSlots'))

  const { updateConnectStatus } = useActionCreators(sseActions)

  const [connectQuery, queryState] = useLazyConnectAuctionSlotsSSEQuery()

  useEffect(() => {
    if (queryState.isSuccess) {
      updateConnectStatus({ eventType: 'auctionSlots', isConnected: true })
    }
  }, [queryState.isSuccess])

  useEffect(() => {
    const unsubcribe = auctionSlotsSSEClient.onSSEEvent('onclose', () => {
      updateConnectStatus({ eventType: 'auctionSlots', isConnected: false })
    })

    return () => {
      unsubcribe()
    }
  })

  useEffect(() => {
    if (!listenersRef.current)
      return

    const unsubcribeCbArr = (Object.keys(listenersRef.current) as Array<keyof AuctionSlotsEventsCallbacks>)
      .reduce<Array<() => void>>((acc, event) => {
        const eventHandler = listenersRef.current[event]
        const unsubscribe = auctionSlotsSSEClient.onEvent(event, eventHandler)

        acc.push(unsubscribe)

        return acc
      }, [])

    return () => {
      unsubcribeCbArr.forEach(unsubscribe => unsubscribe())
    }
  })

  return { isConnected, connect: connectQuery, queryState }
}

type UseAppSSEListeners = {
  donations?: DonationsSSEChannelEventsMap
  auctionSlots?: AuctionSlotsEventsCallbacks
}

export const useAppSSE = (listeners?: UseAppSSEListeners) => {
  const isAllConnected = useStoreSelector(sseSelectors.getIsAllEventsConnected)

  const [isTabLeader, setIsTabLeader] = useState(() => {
    mainSSEBroadcastChannel.onChannelLeadership(() => setIsTabLeader(true))
    return mainSSEBroadcastChannel.isLeader
  })
  const [isPending, setIsPending] = useState(false)
  const internalIsPendingRef = useRef(false)

  const { setAllConnected } = useActionCreators(sseActions)

  const { connect: connectAuctionSlotsSSEQuery } = useAuctionSlotsSSE(listeners?.auctionSlots)
  const { connect: connectDonationsSSEQuery } = useDonationsSSE(listeners?.donations)

  const connectToSSEEvents = useCallback(async (auctionUUID: string) => {
    const isShouldSkipQuery = isAllConnected || isPending || internalIsPendingRef.current

    if (isShouldSkipQuery)
      return

    internalIsPendingRef.current = true

    try {
      setIsPending(true)

      await Promise.all([
        connectAuctionSlotsSSEQuery({ auctionUUID }).unwrap(),
        connectDonationsSSEQuery({ auctionUUID }).unwrap(),
      ])

      setAllConnected(true)
    }
    catch (error) {
      if (error instanceof Error || isAxiosError(error))
        throw error
    }
    finally {
      setIsPending(false)
      internalIsPendingRef.current = false
    }
  }, [isAllConnected, isPending])

  return { isAllConnected, isTabLeader, isPending, connectToSSEEvents }
}
