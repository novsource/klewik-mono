import { useEffect, useRef } from 'react'

import type { AppSSEEventsCallbacks } from '~shared/api/sse/clients'
import { appSSEClient } from '~shared/api/sse/clients'

import type { SSEClient } from '~shared/lib/fetch-event-source'
import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { sseActions, sseSelectors } from '~shared/store/slices'

import { chain } from '~shared/utils/common'

import { useLocalStorage } from '../use-local-storage'
import { useTabLeader } from '../use-tab-leader/use-tab-leader'

export type SSEDataLocalStorage = {
  isConnected: boolean
  disconnectWithError?: boolean
}

type UseSSEClientOptions = {
  onTabBecomesLeader?: () => void
  onNewTabLeader?: () => void
  listeners?: Partial<AppSSEEventsCallbacks>
}

export const useAppSSE = (options?: UseSSEClientOptions) => {
  const optionsRef = useRef(options)

  const isConnected = useStoreSelector(sseSelectors.getIsConnected)

  const { resetState, setIsConnected } = useActionCreators(sseActions)

  const client = useBaseSSEClient(appSSEClient, {
    getConnectionUrl: auctionUUID => `${auctionUUID}/sse/auction-events`,
    eventListeners: optionsRef.current?.listeners,
  })

  const { channel: tabChannel, recreateChannel, isTabLeader } = useTabLeader(
    { onCurrentTabBecomesLeader: optionsRef.current?.onTabBecomesLeader },
  )
  const isCurrentTabLeader = tabChannel.isLeader || isTabLeader

  const sseDataLocalStorage = useLocalStorage<SSEDataLocalStorage>('sseData')

  useEffect(() => {
    if (tabChannel.isClosed) {
      recreateChannel()
    }
  }, [tabChannel.isClosed, recreateChannel])

  useEffect(() => {
    const storedSSEConnectionStatus = sseDataLocalStorage.value?.isConnected

    const actualConnectionStatus
      = isCurrentTabLeader
        ? isConnected
        : storedSSEConnectionStatus ?? false

    const isStorageEmpty = typeof storedSSEConnectionStatus !== 'boolean'
    const isStorageOutdated = storedSSEConnectionStatus !== undefined
      && typeof storedSSEConnectionStatus === 'boolean'
      && storedSSEConnectionStatus !== actualConnectionStatus

    if (isCurrentTabLeader && (isStorageEmpty || isStorageOutdated)) {
      sseDataLocalStorage.set({ isConnected: actualConnectionStatus })
    }

    const isStoredDifferentConnectionStatus = actualConnectionStatus !== isConnected

    if (isStoredDifferentConnectionStatus) {
      setIsConnected(actualConnectionStatus)
    }
  }, [
    isCurrentTabLeader,
    client.isConnected,
    sseDataLocalStorage,
    isConnected,
    setIsConnected,
  ])

  console.log(tabChannel.isLeader)

  const onNewLeaderHandlerRef = useRef(() => {
    const resetConnect = () => {
      sseDataLocalStorage.set({ isConnected: false })
      resetState()
    }

    const onNewLeaderHandler
      = optionsRef.current?.onNewTabLeader
        ? chain<void>(resetConnect, optionsRef.current.onNewTabLeader)
        : resetConnect

    return onNewLeaderHandler()
  })

  useEffect(() => {
    const handler = onNewLeaderHandlerRef.current

    tabChannel.onNewLeader(handler)

    return () => {
      tabChannel.off('new-leader', handler)
    }
  }, [tabChannel])

  console.log(tabChannel)

  useEffect(() => {
    if (!isCurrentTabLeader) {
      return
    }

    const handleUnload = () => {
      sseDataLocalStorage.set({ isConnected: false })
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [isCurrentTabLeader, tabChannel, sseDataLocalStorage])

  const connect = (auctionUUID: string) => {
    if (isConnected)
      return

    client.connectToSSE(auctionUUID)
  }

  const disconnect = () => {
    if (!isCurrentTabLeader)
      return

    client.disconnect()
  }

  return {
    isConnected,
    isPending: !isConnected,
    connect,
    disconnect,
    subscribeOnBaseSSEEvent: client.subscribeOnBaseSSEEvent,
    subscribeOnCustomEvent: client.subscribeOnEvent,
  }
}

type GetConnectionUrl = (auctionUUID: string) => string

type UseBaseChannelSSEOptions<EventsCallbacksMap extends Record<string, (data: any) => void>> = {
  getConnectionUrl: GetConnectionUrl
  eventListeners?: Partial<EventsCallbacksMap>
}

function useBaseSSEClient<EventsMap extends Record<string, any>>(client: SSEClient<EventsMap>, options: UseBaseChannelSSEOptions<EventsMap>) {
  const storedIsConnected = useStoreSelector(sseSelectors.getIsConnected)

  const { setIsConnected } = useActionCreators(sseActions)

  useEffect(() => {
    const onOpenUnsub = client.onSSEEvent('onopen', () => {
      setIsConnected(true)
    })

    const onCloseUnsub = client.onSSEEvent('onclose', () => {
      setIsConnected(false)
    })

    return () => {
      onOpenUnsub()
      onCloseUnsub()
    }
  }, [client.onSSEEvent, setIsConnected])

  useEffect(() => {
    const eventListeners = options.eventListeners

    if (!eventListeners)
      return

    const unsubscribeCbArr = (Object.keys(eventListeners) as Array<keyof EventsMap>)
      .reduce<Array<() => void>>((acc, event) => {
        const listener = eventListeners[event]

        if (!listener)
          return acc

        const unsubscribe = client.onEvent(event, listener)

        acc.push(unsubscribe)

        return acc
      }, [])

    return () => {
      unsubscribeCbArr.forEach(cb => cb())
    }
  }, [client, options.eventListeners])

  useEffect(() => {
    const handleUnload = () => {
      client.disconnect()
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [client])

  const connectToSSE = (auctionUUID: string) => {
    const url = options.getConnectionUrl(auctionUUID)

    return client.connectToServer(url)
  }

  return {
    connectToSSE,
    disconnect: client.disconnect,
    isConnected: storedIsConnected,
    subscribeOnEvent: client.onEvent,
    subscribeOnBaseSSEEvent: client.onSSEEvent,
  }
}
