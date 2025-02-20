import {
  SSEClient,
  SSEClientListeners,
  SSEEmiter,
  SSEEvents,
} from '~shared/lib/fetch-event-source'

import { BROADCAST_CHANNEL_NAMES as BROADCAST_CHANNELS_NAMES } from '~shared/constants/broadcast-channels'

import { DonationsEventSourceMessageSchema } from './channel.contracts'
import { DonationsEventsCallbacks, DonationsEventsMap } from './channel.types'
import { DonationsBroadcastChannel } from './donations-channel'

class DonationsSSEClient extends SSEClient {
  private static _instance: DonationsSSEClient
  private readonly _broadcastChannel: DonationsBroadcastChannel
  private _emitter = new SSEEmiter()

  private constructor() {
    super()

    this._broadcastChannel = new DonationsBroadcastChannel(
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

  onChannelLeadership(listener: () => void) {
    this._broadcastChannel.onLeadership(listener)
  }

  removeListener<K extends keyof DonationsEventsMap>(
    event: K,
    callback: (data: DonationsEventsMap[K]) => void
  ) {
    return this._broadcastChannel.removeListener(event, callback)
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
        this._broadcastChannel.postMessage(parsedMessage.data)

        if (this._broadcastChannel.isLeader) {
          this._broadcastChannel.emit(parsedMessage.data)
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

  onNewDonation(callback: DonationsEventsCallbacks['donations/add']) {
    return this._broadcastChannel.on('donations/add', callback)
  }
}

export { DonationsSSEClient }
