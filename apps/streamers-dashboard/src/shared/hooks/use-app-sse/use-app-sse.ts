import { useCallback, useEffect, useRef, useState } from 'react'

import { isAxiosError } from 'axios'

import { auctionSlotsSSEClient } from '~shared/api/sse/clients/auction-slots'
import type { AuctionSlotsEventsCallbacks } from '~shared/api/sse/clients/auction-slots'
import { donationsSSEClient } from '~shared/api/sse/clients/donations'
import type { DonationsSSEChannelEventsMap } from '~shared/api/sse/clients/donations'
import type { IntegrationsSSEEventsCallbacksMap } from '~shared/api/sse/clients/integrations/client.types'
import { integrationsSSEClient } from '~shared/api/sse/clients/integrations/integrations-client'

import type { SSE_CHANNELS } from '~shared/constants/api'

import { BroadcastLeaderChannel } from '~shared/lib/broadcast-channel'
import type { SSEClient } from '~shared/lib/fetch-event-source'
import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { useLazyConnectAuctionSlotsSSEQuery, useLazyConnectDonationsSSEQuery, useLazyConnectIntegrationsSSEQuery } from '~shared/store/api'
import { sseActions, sseSelectors } from '~shared/store/slices'

const mainSSEBroadcastChannel = new BroadcastLeaderChannel('mainSSEChannel')

type UseBaseChannelSSEOptions<EventsCallbacksMap extends Record<string, (data: any) => void>> = {
  name: typeof SSE_CHANNELS[number]
  eventListeners?: Partial<EventsCallbacksMap>
}

const useBaseSSEClient
  = <EventsMap extends Record<string, (data: any) => void>>(client: SSEClient<EventsMap>, options: UseBaseChannelSSEOptions<EventsMap>) => {
    const nameRef = useRef(options.name)
    const eventListenersRef = useRef(options.eventListeners)

    const { isConnected } = useStoreSelector(state => sseSelectors.getEventStatus(state, nameRef.current))

    const { updateConnectStatus } = useActionCreators(sseActions)

    useEffect(() => {
      const unsubcribe = client.onSSEEvent('onopen', () => {
        updateConnectStatus({ eventType: nameRef.current, isConnected: true })
      })

      return () => {
        unsubcribe()
      }
    })

    useEffect(() => {
      const unsubcribe = client.onSSEEvent('onclose', () => {
        console.log('close')
        updateConnectStatus({ eventType: nameRef.current, isConnected: false })
      })

      return () => {
        unsubcribe()
      }
    })

    useEffect(() => {
      const eventListeners = eventListenersRef.current

      if (!eventListeners)
        return

      const unsubcribeCbArr = (Object.keys(eventListeners) as Array<keyof EventsMap>)
        .reduce<Array<() => void>>((acc, event) => {
          const listener = eventListeners[event]

          if (!listener)
            return acc

          const unsubscribe = client.onEvent(event, listener)

          acc.push(unsubscribe)

          return acc
        }, [])

      return () => {
        unsubcribeCbArr.forEach(unsubscribe => unsubscribe())
      }
    })

    return {
      isConnected,
      subscribeOnEvent: client.onEvent,
      subscribeOnBaseSSEEvent: client.onSSEEvent,
    }
  }

export const useDonationsSSE = (listeners?: Partial<DonationsSSEChannelEventsMap>) => {
  const baseSSEClient = useBaseSSEClient(donationsSSEClient, { name: 'donations', eventListeners: listeners })

  const [connectQuery, queryState] = useLazyConnectDonationsSSEQuery()

  return {
    connect: connectQuery,
    queryState,
    ...baseSSEClient,
  }
}

export const useAuctionSlotsSSE = (listeners?: Partial<AuctionSlotsEventsCallbacks>) => {
  const baseSSEClient = useBaseSSEClient(auctionSlotsSSEClient, { name: 'auctionSlots', eventListeners: listeners })

  const [connectQuery, queryState] = useLazyConnectAuctionSlotsSSEQuery()

  return {
    connect: connectQuery,
    queryState,
    ...baseSSEClient,
  }
}

export const useIntegrationsSSE = (listeners?: Partial<IntegrationsSSEEventsCallbacksMap>) => {
  const baseSSEClient = useBaseSSEClient(integrationsSSEClient, { name: 'integrations', eventListeners: listeners })

  const [connectQuery, queryState] = useLazyConnectIntegrationsSSEQuery()

  return {
    connect: connectQuery,
    queryState,
    ...baseSSEClient,
  }
}

type UseAppSSEListeners = {
  donations?: Partial<DonationsSSEChannelEventsMap>
  auctionSlots?: Partial<AuctionSlotsEventsCallbacks>
  integrations?: Partial<IntegrationsSSEEventsCallbacksMap>
}

export const useAppSSE = (listeners?: UseAppSSEListeners) => {
  const isAllConnected = useStoreSelector(sseSelectors.getIsAllEventsConnected)

  const [isTabLeader, setIsTabLeader] = useState(() => {
    mainSSEBroadcastChannel.onChannelLeadership(() => setIsTabLeader(true))
    return mainSSEBroadcastChannel.isLeader
  })
  const [isPending, setIsPending] = useState(false)
  const internalIsPendingRef = useRef(false)

  const { connect: connectAuctionSlotsSSEQuery } = useAuctionSlotsSSE(listeners?.auctionSlots)
  const { connect: connectDonationsSSEQuery } = useDonationsSSE(listeners?.donations)
  const { connect: connectIntegrationsSSEQuery } = useIntegrationsSSE(listeners?.integrations)

  const connectToSSEEvents = useCallback(async (auctionUUID: string) => {
    const isShouldSkipQuery = isAllConnected || internalIsPendingRef.current

    if (isShouldSkipQuery)
      return

    internalIsPendingRef.current = true
    setIsPending(true)

    const connectToSSEArr
      = [
        connectAuctionSlotsSSEQuery,
        connectDonationsSSEQuery,
        connectIntegrationsSSEQuery,
      ].map(query => query({ auctionUUID }).unwrap())

    try {
      await Promise.all(connectToSSEArr)
    }
    catch (error) {
      if (error instanceof Error || isAxiosError(error))
        throw error
    }
    finally {
      internalIsPendingRef.current = false

      setIsPending(false)
    }
  }, [isAllConnected, connectAuctionSlotsSSEQuery, connectDonationsSSEQuery, connectIntegrationsSSEQuery])

  return { isAllConnected, isTabLeader, isPending, connectToSSEEvents }
}
