import { useMemo, useRef, useState } from 'react'

import type { SSEChannels } from '~shared/constants/api'
import { SSE_CHANNELS } from '~shared/constants/api'

import { BroadcastLeaderChannel } from '~shared/lib/broadcast-channel'
import { BaseEmitter } from '~shared/lib/emitter'
import type { EventSourceMessage, SSEEvents } from '~shared/lib/fetch-event-source'
import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import {
  useLazyConnectDonationsSSEQuery,
  useLazyConnectSlotsSSEQuery,
} from '~shared/store/api'
import { sseActions, sseSelectors } from '~shared/store/slices'

const sseChannelsEventsEmitter = SSE_CHANNELS.reduce((acc, channelName) => {
  acc[channelName] = new BaseEmitter()

  return acc
}, {} as Record<SSEChannels, BaseEmitter<SSEEvents>>)

const mainSSEBroadcastChannel = new BroadcastLeaderChannel('mainSSEChannel')

export const useAppSSE = () => {
  const [isPending, setIsPending] = useState(false)
  const [isTabLeader, setIsTabLeader] = useState(() => {
    mainSSEBroadcastChannel.onChannelLeadership(() => setIsTabLeader(true))
    return mainSSEBroadcastChannel.isLeader
  })

  const isAllConnected = useStoreSelector(sseSelectors.getIsAllEventsConnected)
  const sseStore = useStoreSelector(sseSelectors.getState)

  const { updateConnectStatus, setAllConnected } = useActionCreators(sseActions)

  const internalIsPendingRef = useRef(false)

  const [connectDonationsSSEQuery, connectDonationsSSEQueryInfo] = useLazyConnectDonationsSSEQuery()
  const [connectSlotsSSEQuery, connectSlotsSSEQueryInfo] = useLazyConnectSlotsSSEQuery()

  /**
   * @todo Refactor this brilliant code
   */
  const sseChannelsInfo = useMemo(() => {
    return SSE_CHANNELS.reduce<any>((info, channelName) => {
      info[channelName] = {
        ...sseStore[channelName],
        queryInfo: channelName === 'donations' ? connectDonationsSSEQueryInfo : connectSlotsSSEQueryInfo,
        connect: (auctionUUID: string) => {
          const connectQueryArgs = {
            auctionUUID,
            listeners: {
              onopen() {
                updateConnectStatus({ eventType: channelName, isConnected: true })
                setAllConnected(false)

                return Promise.resolve()
              },
              onerror(error: unknown) {
                sseChannelsEventsEmitter[channelName].emit('onerror', error)
              },
              onmessage(message: EventSourceMessage) {
                sseChannelsEventsEmitter[channelName].emit('onmessage', message)
              },
              onclose() {
                updateConnectStatus({ eventType: channelName, isConnected: false })
                setAllConnected(false)
              },
            },
          }

          return channelName === 'donations'
            ? connectDonationsSSEQuery(connectQueryArgs)
            : connectSlotsSSEQuery(connectQueryArgs)
        },
      }

      return info
    }, {})
  }, [sseStore.donations, sseStore.auctionSlots])

  const connectToAllEvents = async (auctionUUID: string) => {
    if (internalIsPendingRef.current)
      return

    const connectPromisesArray = []

    for (const [_, channelData] of Object.entries(sseChannelsInfo)) {
      if (!channelData.isConnected) {
        connectPromisesArray.push(channelData.connect(auctionUUID))
      }
    }

    try {
      internalIsPendingRef.current = true

      return Promise.all(connectPromisesArray).finally(() => {
        internalIsPendingRef.current = false
        setIsPending(false)
      })
    }
    catch (error) {
      internalIsPendingRef.current = false

      if (error instanceof Error)
        throw error
    }
  }

  const addEventListener = <Event extends keyof SSEEvents>(channel: SSEChannels, event: Event, handler: NonNullable<SSEEvents[Event]>) => {
    return sseChannelsEventsEmitter[channel].on(event, handler)
  }

  return {
    isTabLeader,
    isAllConnected,
    isPending,
    connectToAllEvents,
    addEventListener,
  }
}
