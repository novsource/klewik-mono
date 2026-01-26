import { useEffect, useRef, useState } from 'react'

import { isAxiosError } from 'axios'

import { auctionSlotsSSEClient } from '~shared/api/sse/clients/auction-slots'
import type { AuctionSlotsEventsCallbacks } from '~shared/api/sse/clients/auction-slots'
import { donationsSSEClient } from '~shared/api/sse/clients/donations'
import type { DonationsSSEChannelEventsMap } from '~shared/api/sse/clients/donations'
import type { IntegrationsSSEEventsCallbacksMap } from '~shared/api/sse/clients/integrations/client.types'
import { integrationsSSEClient } from '~shared/api/sse/clients/integrations/integrations-client'

import type { SSE_CHANNELS } from '~shared/constants/api'

import type { SSEClient } from '~shared/lib/fetch-event-source'
import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { useLazyConnectAuctionSlotsSSEQuery, useLazyConnectDonationsSSEQuery, useLazyConnectIntegrationsSSEQuery } from '~shared/store/api'
import { sseActions, sseSelectors } from '~shared/store/slices'

import { chain } from '~shared/utils'

import { useTabLeader } from '../use-tab-leader/use-tab-leader'

type UseAppSSEOptions = {
  onTabBecomesLeader?: () => void
  onNewTabLeader?: () => void
}

// const appSSEBroadcastChannel = new BroadcastLeaderChannel('appSSEChannel')

export const useAppSSE = (options?: UseAppSSEOptions) => {
  const isAllEventsConnected = useStoreSelector(sseSelectors.getIsAllEventsConnected)

  const { resetState } = useActionCreators(sseActions)

  const [isPending, setIsPending] = useState(false)
  const internalIsPendingRef = useRef(false)

  const { connect: connectAuctionSlotsSSEQuery, queryState: { reset: resetSlotsQuery } } = useAuctionSlotsSSE()
  const { connect: connectDonationsSSEQuery, queryState: { reset: resetDonationsQuery } } = useDonationsSSE()
  const { connect: connectIntegrationsSSEQuery, queryState: { reset: resetIntegrationsQuery } } = useIntegrationsSSE()

  const { channel: tabLeaderChannel } = useTabLeader()

  const resetConnectionQueries = () => {
    [resetDonationsQuery, resetSlotsQuery, resetIntegrationsQuery].forEach(resetFn => resetFn())
  }

  const connectToSSEEvents = async (auctionUUID: string) => {
    const isShouldSkipConnection = internalIsPendingRef.current

    if (isShouldSkipConnection)
      return

    resetConnectionQueries()

    internalIsPendingRef.current = true
    setIsPending(true)

    const eventsConnectionsQueryArr
      = [
        connectAuctionSlotsSSEQuery,
        connectDonationsSSEQuery,
        connectIntegrationsSSEQuery,
      ].map(query => query({ auctionUUID }).unwrap())

    try {
      await Promise.all(eventsConnectionsQueryArr)
    }
    catch (error) {
      if (error instanceof Error || isAxiosError(error))
        throw error
    }
    finally {
      internalIsPendingRef.current = false

      setIsPending(false)
    }
  }

  useEffect(() => {
    const onNewLeaderHandler
      = options?.onNewTabLeader
        ? chain(options.onNewTabLeader, resetState)
        : resetState

    tabLeaderChannel.onNewLeader(onNewLeaderHandler)

    return () => {
      tabLeaderChannel.off('new-leader', onNewLeaderHandler)
    }
  }, [resetState, options?.onNewTabLeader, tabLeaderChannel])

  return { isAllEventsConnected, isPending, connectToSSEEvents }
}

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

export function useDonationsSSE(listeners?: Partial<DonationsSSEChannelEventsMap>) {
  const client = useBaseSSEClient(donationsSSEClient, { name: 'donations', eventListeners: listeners })

  const [connectQuery, queryState] = useLazyConnectDonationsSSEQuery()

  return {
    connect: connectQuery,
    queryState,
    ...client,
  }
}

export function useAuctionSlotsSSE(listeners?: Partial<AuctionSlotsEventsCallbacks>) {
  const client = useBaseSSEClient(auctionSlotsSSEClient, { name: 'auctionSlots', eventListeners: listeners })

  const [connectQuery, queryState] = useLazyConnectAuctionSlotsSSEQuery()

  return {
    connect: connectQuery,
    queryState,
    ...client,
  }
}

export function useIntegrationsSSE(listeners?: Partial<IntegrationsSSEEventsCallbacksMap>) {
  const client = useBaseSSEClient(integrationsSSEClient, { name: 'integrations', eventListeners: listeners })

  const [connectQuery, queryState] = useLazyConnectIntegrationsSSEQuery()

  return {
    connect: connectQuery,
    queryState,
    ...client,
  }
}
