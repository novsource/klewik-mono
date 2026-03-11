import { useEffect, useRef } from 'react'

import { auctionSlotsSSEClient } from '~shared/api/sse/clients/auction-slots'
import type { AuctionSlotsEventsCallbacks } from '~shared/api/sse/clients/auction-slots'
import { donationsSSEClient } from '~shared/api/sse/clients/donations'
import type { DonationsSSEChannelEventsMap } from '~shared/api/sse/clients/donations'
import type { IntegrationsSSEEventsCallbacksMap } from '~shared/api/sse/clients/integrations/client.types'
import { integrationsSSEClient } from '~shared/api/sse/clients/integrations/integrations-client'

import type { SSE_CHANNELS } from '~shared/constants/api'

import type { SSEClient } from '~shared/lib/fetch-event-source'
import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { sseActions, sseSelectors } from '~shared/store/slices'

import { chain } from '~shared/utils/common'

import { useLocalStorage } from '../use-local-storage'
import { useTabLeader } from '../use-tab-leader/use-tab-leader'

type SSEDataLocalStorage = {
  isConnected: boolean
}

type UseAppSSEOptions = {
  onTabBecomesLeader?: () => void
  onNewTabLeader?: () => void
}

export const useAppSSE = (options?: UseAppSSEOptions) => {
  const isAllEventsConnected = useStoreSelector(sseSelectors.getIsAllEventsConnected)

  const { resetState, setAllConnected } = useActionCreators(sseActions)

  const { connectToSSE: connectAuctionSlotsSSEQuery } = useAuctionSlotsSSE()
  const { connectToSSE: connectDonationsSSEQuery } = useDonationsSSE()
  const { connectToSSE: connectIntegrationsSSEQuery } = useIntegrationsSSE()

  const { channel: tabChannel, recreateChannel } = useTabLeader()

  const sseDataLocalStorage = useLocalStorage<SSEDataLocalStorage>('sseData')

  if (tabChannel.isLeader && isAllEventsConnected && sseDataLocalStorage.value?.isConnected !== isAllEventsConnected) {
    sseDataLocalStorage.set({ isConnected: isAllEventsConnected })
  }

  useEffect(() => {
    if (tabChannel.isClosed) {
      recreateChannel()
    }
  }, [tabChannel.isClosed, recreateChannel])

  useEffect(() => {
    const isLeaderConnectedToSSEEvents = sseDataLocalStorage.value?.isConnected

    if (
      !tabChannel.isLeader
      && isLeaderConnectedToSSEEvents
      && isLeaderConnectedToSSEEvents !== isAllEventsConnected
    ) {
      setAllConnected(isLeaderConnectedToSSEEvents)
    }
  }, [tabChannel, isAllEventsConnected, sseDataLocalStorage.value, setAllConnected])

  useEffect(() => {
    const resetConnectionLocalStorage = () => {
      sseDataLocalStorage.set({ isConnected: false })
    }

    const onNewLeaderHandler
      = options?.onNewTabLeader
        ? chain<void>(options.onNewTabLeader, resetState, resetConnectionLocalStorage)
        : chain<void>(resetState, resetConnectionLocalStorage)

    tabChannel.onNewLeader(onNewLeaderHandler)

    return () => {
      tabChannel.off('new-leader', onNewLeaderHandler)
    }
  }, [resetState, options?.onNewTabLeader, tabChannel, sseDataLocalStorage])

  useEffect(() => {
    const handleUnload = () => {
      if (sseDataLocalStorage.value?.isConnected && tabChannel.isLeader)
        sseDataLocalStorage.set({ isConnected: false })
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      handleUnload()
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [tabChannel, sseDataLocalStorage])

  const connectToSSEEvents = async (auctionUUID: string) => {
    if (!tabChannel.isLeader)
      return

    connectAuctionSlotsSSEQuery(auctionUUID)
    connectDonationsSSEQuery(auctionUUID)
    connectIntegrationsSSEQuery(auctionUUID)
  }

  return { isAllEventsConnected, isPending: !isAllEventsConnected, connectToSSEEvents }
}

type UseBaseChannelSSEOptions<EventsCallbacksMap extends Record<string, (data: any) => void>> = {
  name: typeof SSE_CHANNELS[number]
  eventListeners?: Partial<EventsCallbacksMap>
}

const useBaseSSEClient
  = <EventsMap extends Record<string, any>>(client: SSEClient<EventsMap>, options: UseBaseChannelSSEOptions<EventsMap>) => {
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
    }, [client, updateConnectStatus])

    useEffect(() => {
      client.onSSEEvent('onclose', () => {
        updateConnectStatus({ eventType: nameRef.current, isConnected: false })
      })
    }, [client, updateConnectStatus])

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
        unsubcribeCbArr.forEach(cb => cb())
      }
    })

    useEffect(() => {
      const handleUnload = () => {
        updateConnectStatus({ eventType: nameRef.current, isConnected: false })
        client.disconnect()
      }

      window.addEventListener('beforeunload', handleUnload)

      return () => {
        handleUnload()
        window.removeEventListener('beforeunload', handleUnload)
      }
    }, [client, updateConnectStatus])

    return {
      isConnected,
      subscribeOnEvent: client.onEvent,
      subscribeOnBaseSSEEvent: client.onSSEEvent,
    }
  }

export function useDonationsSSE(listeners?: Partial<DonationsSSEChannelEventsMap>) {
  const client = useBaseSSEClient(donationsSSEClient, { name: 'donations', eventListeners: listeners })

  const connectToSSE = (auctionUUID: string) => {
    return donationsSSEClient.connectToServer(`${auctionUUID}/sse/donations-events`)
  }

  return { ...client, connectToSSE }
}

export function useAuctionSlotsSSE(listeners?: Partial<AuctionSlotsEventsCallbacks>) {
  const client = useBaseSSEClient(auctionSlotsSSEClient, { name: 'auctionSlots', eventListeners: listeners })

  const connectToSSE = (auctionUUID: string) => {
    return auctionSlotsSSEClient.connectToServer(`${auctionUUID}/sse/slots-events`)
  }

  return { ...client, connectToSSE }
}

export function useIntegrationsSSE(listeners?: Partial<IntegrationsSSEEventsCallbacksMap>) {
  const client = useBaseSSEClient(integrationsSSEClient, { name: 'integrations', eventListeners: listeners })

  const connectToSSE = (auctionUUID: string) => {
    return integrationsSSEClient.connectToServer(`${auctionUUID}/sse/integrations-events`)
  }

  return { ...client, connectToSSE }
}
