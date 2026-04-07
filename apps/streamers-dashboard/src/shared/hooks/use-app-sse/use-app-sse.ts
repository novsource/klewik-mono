/*
  Should be refactored in the future
  TODO: refactor
*/

// import { useEffect, useRef } from 'react'

// import { auctionSlotsSSEClient } from '~shared/api/sse/clients/auction-slots'
// import type { AuctionSlotsEventsCallbacks } from '~shared/api/sse/clients/auction-slots'
// import { donationsSSEClient } from '~shared/api/sse/clients/donations'
// import type { DonationsSSEChannelEventsMap } from '~shared/api/sse/clients/donations'
// import type { IntegrationsSSEEventsCallbacksMap } from '~shared/api/sse/clients/integrations/client.types'
// import { integrationsSSEClient } from '~shared/api/sse/clients/integrations/integrations-client'

// import { SSE_CHANNELS_CONNECT_ENDPOINTS } from '~shared/constants/api'
// import type { SSE_CHANNELS } from '~shared/constants/api'

// import type { SSEClient } from '~shared/lib/fetch-event-source'
// import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

// import { sseActions, sseSelectors } from '~shared/store/slices'

// import { chain } from '~shared/utils/common'

// import { useLocalStorage } from '../use-local-storage'
// import { useTabLeader } from '../use-tab-leader/use-tab-leader'

// type GetConnectionUrl = (auctionUUID: string) => string

// export type SSEDataLocalStorage = {
//   isConnected: boolean
// }

// type UseAppSSEOptions = {
//   onTabBecomesLeader?: () => void
//   onNewTabLeader?: () => void
// }

// export const useAppSSE = (options?: UseAppSSEOptions) => {
//   const optionsRef = useRef(options)

//   const isAllEventsConnected = useStoreSelector(sseSelectors.getIsAllEventsConnected)

//   const { resetState, setAllConnected } = useActionCreators(sseActions)

//   const auctionSlotsSSE = useAuctionSlotsSSE()
//   const donationsSSE = useDonationsSSE()
//   const integrationsSSE = useIntegrationsSSE()

//   const { channel: tabChannel, recreateChannel } = useTabLeader()

//   const sseDataLocalStorage = useLocalStorage<SSEDataLocalStorage>('sseData')

//   useEffect(() => {
//     if (tabChannel.isClosed) {
//       recreateChannel()
//     }
//   }, [tabChannel.isClosed, recreateChannel])

//   useEffect(() => {
//     const storedSSEConnectionStatus = sseDataLocalStorage.value?.isConnected

//     const actualConnectionStatus
//       = tabChannel.isLeader
//         ? [auctionSlotsSSE, donationsSSE, integrationsSSE].every(client => Boolean(client.isConnected))
//         : storedSSEConnectionStatus ?? false

//     const isStorageEmpty = typeof storedSSEConnectionStatus !== 'boolean'
//     const isStorageOutdated
//       = storedSSEConnectionStatus !== undefined
//         && typeof storedSSEConnectionStatus === 'boolean'
//         && storedSSEConnectionStatus !== actualConnectionStatus

//     if (tabChannel.isLeader && (isStorageEmpty || isStorageOutdated)) {
//       sseDataLocalStorage.set({ isConnected: actualConnectionStatus })
//     }

//     const isStoredDifferentConnectionStatus = actualConnectionStatus !== isAllEventsConnected

//     if (isStoredDifferentConnectionStatus) {
//       setAllConnected(actualConnectionStatus)
//     }
//   }, [
//     tabChannel.isLeader,
//     auctionSlotsSSE.isConnected,
//     donationsSSE.isConnected,
//     integrationsSSE.isConnected,
//     sseDataLocalStorage.value?.isConnected,
//     isAllEventsConnected,
//     setAllConnected,
//   ])

//   const onNewLeaderHandlerRef = useRef(() => {
//     const resetConnect = () => {
//       sseDataLocalStorage.set({ isConnected: false })
//       resetState()
//     }

//     const onNewLeaderHandler
//       = optionsRef.current?.onNewTabLeader
//         ? chain<void>(resetConnect, optionsRef.current.onNewTabLeader)
//         : resetConnect

//     return onNewLeaderHandler()
//   })

//   useEffect(() => {
//     const handler = onNewLeaderHandlerRef.current

//     tabChannel.onNewLeader(handler)

//     return () => {
//       tabChannel.off('new-leader', handler)
//     }
//   }, [tabChannel])

//   useEffect(() => {
//     if (!tabChannel.isLeader) {
//       return
//     }

//     const handleUnload = () => {
//       sseDataLocalStorage.set({ isConnected: false })
//     }

//     window.addEventListener('beforeunload', handleUnload)

//     return () => {
//       window.removeEventListener('beforeunload', handleUnload)
//     }
//   }, [tabChannel, sseDataLocalStorage])

//   const connectAll = (auctionUUID: string) => {
//     if (!tabChannel.isLeader || isAllEventsConnected)
//       return

//     auctionSlotsSSE.connectToSSE(auctionUUID)
//     donationsSSE.connectToSSE(auctionUUID)
//     integrationsSSE.connectToSSE(auctionUUID)
//   }

//   const disconnectAll = () => {
//     if (!tabChannel.isLeader)
//       return

//     auctionSlotsSSE.disconnect()
//     donationsSSE.disconnect()
//     integrationsSSE.disconnect()
//   }

//   return { isAllEventsConnected, isPending: !isAllEventsConnected, connectAll, disconnectAll }
// }

// export function useDonationsSSE(listeners?: Partial<DonationsSSEChannelEventsMap>) {
//   const client = useBaseSSEClient(donationsSSEClient, {
//     name: 'donations',
//     eventListeners: listeners,
//     getConnectionUrl: SSE_CHANNELS_CONNECT_ENDPOINTS.donations,
//   })

//   return client
// }

// export function useAuctionSlotsSSE(listeners?: Partial<AuctionSlotsEventsCallbacks>) {
//   const client = useBaseSSEClient(auctionSlotsSSEClient, {
//     name: 'auctionSlots',
//     eventListeners: listeners,
//     getConnectionUrl: SSE_CHANNELS_CONNECT_ENDPOINTS.auctionSlots,
//   })

//   return client
// }

// export function useIntegrationsSSE(listeners?: Partial<IntegrationsSSEEventsCallbacksMap>) {
//   const client = useBaseSSEClient(integrationsSSEClient, {
//     name: 'integrations',
//     eventListeners: listeners,
//     getConnectionUrl: SSE_CHANNELS_CONNECT_ENDPOINTS.integrations,
//   })

//   return client
// }

// type UseBaseChannelSSEOptions<EventsCallbacksMap extends Record<string, (data: any) => void>> = {
//   name: typeof SSE_CHANNELS[number]
//   getConnectionUrl: GetConnectionUrl
//   eventListeners?: Partial<EventsCallbacksMap>
// }

// function useBaseSSEClient<EventsMap extends Record<string, any>>(client: SSEClient<EventsMap>, options: UseBaseChannelSSEOptions<EventsMap>) {
//   const nameRef = useRef(options.name)

//   const { isConnected } = useStoreSelector(state => sseSelectors.getEventStatus(state, nameRef.current))

//   const { updateConnectStatus } = useActionCreators(sseActions)

// useEffect(() => {
//   const onOpenUnsub = client.onSSEEvent('onopen', () => {
//     updateConnectStatus({ eventType: nameRef.current, isConnected: true })
//   })

//   const onCloseUnsub = client.onSSEEvent('onclose', () => {
//     updateConnectStatus({ eventType: nameRef.current, isConnected: false })
//   })

//   return () => {
//     onOpenUnsub()
//     onCloseUnsub()
//   }
// }, [client, updateConnectStatus])

//   useEffect(() => {
//     const eventListeners = options.eventListeners

//     if (!eventListeners)
//       return

//     const unsubscribeCbArr = (Object.keys(eventListeners) as Array<keyof EventsMap>)
//       .reduce<Array<() => void>>((acc, event) => {
//         const listener = eventListeners[event]

//         if (!listener)
//           return acc

//         const unsubscribe = client.onEvent(event, listener)

//         acc.push(unsubscribe)

//         return acc
//       }, [])

//     return () => {
//       unsubscribeCbArr.forEach(cb => cb())
//     }
//   }, [client, options.eventListeners])

//   useEffect(() => {
//     const handleUnload = () => {
//       client.disconnect()
//     }

//     window.addEventListener('beforeunload', handleUnload)

//     return () => {
//       window.removeEventListener('beforeunload', handleUnload)
//     }
//   }, [client])

//   const connectToSSE = (auctionUUID: string) => {
//     const url = options.getConnectionUrl(auctionUUID)

//     return client.connectToServer(url)
//   }

//   return {
//     connectToSSE,
//     disconnect: client.disconnect,
//     isConnected,
//     subscribeOnEvent: client.onEvent,
//     subscribeOnBaseSSEEvent: client.onSSEEvent,
//   }
// }
