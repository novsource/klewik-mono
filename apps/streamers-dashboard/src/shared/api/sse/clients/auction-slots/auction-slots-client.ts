import {
  BaseSSEClient,
  SSEClientConnectOptions,
  SSEClientListeners,
  SSEEmiter,
  SSEEvents,
} from '~shared/lib/fetch-event-source'

import { BROADCAST_CHANNEL_NAMES as BROADCAST_CHANNELS_NAMES } from '~shared/constants/broadcast-channels'

import { AuctionSlotsBroadcastChannel } from './auction-slots-channel'
import { AuctionSlotsEventsMessageSchema } from './channel.contracts'
import { AuctionSlotsEventsMap } from './channel.types'

class AuctionSlotsSSEClient extends BaseSSEClient {
  private static _instance: AuctionSlotsSSEClient
  private readonly _broadcastChannel: AuctionSlotsBroadcastChannel
  private _emitter = new SSEEmiter()

  private constructor() {
    super()

    this._broadcastChannel = new AuctionSlotsBroadcastChannel(
      BROADCAST_CHANNELS_NAMES.AUCTION_SLOTS
    )
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new AuctionSlotsSSEClient()
    }

    return this._instance
  }

  on<K extends keyof SSEEvents>(
    eventName: K,
    callback: (data: Parameters<NonNullable<SSEEvents[K]>>[number]) => void
  ) {
    this._emitter.subscribe(eventName, callback)
  }

  onAddingSlots(
    callback: (data: AuctionSlotsEventsMap['auction-slots/add']) => void
  ) {
    return this._broadcastChannel.on('auction-slots/add', callback)
  }

  async connectToServer(
    auctionId: string,
    options?: SSEClientConnectOptions & { lastMessageId?: number }
  ): Promise<void> {
    const listeners: SSEClientListeners = {
      onopen: async (response) => {
        if (response.status === 200) this._emitter.notify('onopen', response)
      },
      onerror: (err) => {
        if (err instanceof Error) {
          this._emitter.notify('onerror', err)
          throw err
        }
      },
      onmessage: (message) => {
        if (message.event === 'connected') return

        const parsedMessage = AuctionSlotsEventsMessageSchema.safeParse(message)

        if (
          parsedMessage.data === undefined ||
          parsedMessage.error ||
          !parsedMessage.success
        ) {
          this._emitter.notify('onerror', parsedMessage.error)
          return
        }

        this._emitter.notify('onmessage', parsedMessage.data)
        this._broadcastChannel.postMessage(parsedMessage.data)

        if (this._broadcastChannel.isLeader) {
          this._broadcastChannel.postMessage(parsedMessage.data)
        }
      },
      onclose: () => this._emitter.notify('onclose'),
    }

    return this.connect(`${auctionId}/slots-events`, listeners, {
      ...options,
      retry: { counts: 5, delay: 1000 },
    }).catch((err) => {
      throw err
    })
  }
}

export { AuctionSlotsSSEClient }
