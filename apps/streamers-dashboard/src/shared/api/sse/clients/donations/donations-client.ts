import {
  BaseSSEClient,
  SSEClientListeners,
  SSEEmiter,
  SSEEvents,
} from '~shared/lib/fetch-event-source'

import { BROADCAST_CHANNEL_NAMES as BROADCAST_CHANNELS_NAMES } from '~shared/constants/broadcast-channels'

import { DonationsEventSourceMessageSchema } from './channel.contracts'
import { DonationsEventsCallbacks } from './channel.types'
import { DonationsSSEBroadcastChannel } from './donations-channel'

class DonationsSSEClient extends BaseSSEClient {
  private static _instance: DonationsSSEClient
  private readonly _broadcastChannel: DonationsSSEBroadcastChannel
  private _emitter = new SSEEmiter()

  private constructor() {
    super()

    this._broadcastChannel = new DonationsSSEBroadcastChannel(
      BROADCAST_CHANNELS_NAMES.DONATIONS
    )
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new DonationsSSEClient()
    }

    return this._instance
  }

  on<K extends keyof SSEEvents>(
    eventName: K,
    callback: (data: Parameters<NonNullable<SSEEvents[K]>>[number]) => void
  ) {
    this._emitter.subscribe(eventName, callback)
  }

  onNewDonation(callback: DonationsEventsCallbacks['donations/add']) {
    return this._broadcastChannel.on('donations/add', callback)
  }

  async connectToServer(
    auctionId: string,
    lastMessageId?: number
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

        const parsedMessage =
          DonationsEventSourceMessageSchema.safeParse(message)

        if (
          parsedMessage.data === undefined ||
          parsedMessage.error ||
          !parsedMessage.success
        ) {
          this._emitter.notify('onerror', parsedMessage.error)
          return
        }

        this._emitter.notify('onmessage', parsedMessage.data)

        if (this._broadcastChannel.isLeader) {
          this._broadcastChannel.postMessage(parsedMessage.data)
        }
      },
      onclose: () => this._emitter.notify('onclose'),
    }

    return this.connect(`${auctionId}/donations-events`, listeners, {
      lastMessageId,
      retry: { counts: 5, delay: 1000 },
    }).catch((err) => {
      throw err
    })
  }
}

export { DonationsSSEClient }
