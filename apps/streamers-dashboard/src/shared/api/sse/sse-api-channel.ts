import { BroadcastChannelOptions } from 'broadcast-channel'
import { ZodError, z } from 'zod'

import { BroadcastLeaderChannel } from '~shared/lib/broadcast-channel'
import { EventSourceMessage } from '~shared/lib/fetch-event-source'

type SSEApiEventsMap = {
  'manager/new': {
    auctionId: string
  }
  'manager/status': {
    auctionId: string
    isConnected: boolean
  }
  'manager/leader-changed': {
    auctionId: string
  }
  'manager/get-status': {
    auctionId: string
  }
}

export type SSEApiEventSourceMessage = EventSourceMessage & {
  event:
    | 'manager/new'
    | 'manager/status'
    | 'manager/leader-changed'
    | 'manager/get-status'
  data: string
}

type SSEApiBroadcastChannelOptions = Partial<BroadcastChannelOptions> & {
  auctionId: string
}

export class SSEApiBroadcastChannel extends BroadcastLeaderChannel<SSEApiEventSourceMessage> {
  private _auctionId: string
  private readonly _subscriptions = new Map<
    keyof SSEApiEventsMap,
    Array<(arg: SSEApiEventsMap[keyof SSEApiEventsMap]) => void>
  >([])

  constructor(channelName: string, options: SSEApiBroadcastChannelOptions) {
    const { auctionId, ...channelOptions } = options

    super(channelName, channelOptions)

    this._auctionId = auctionId

    this.onMessage((message) => this._dispatchEvent(message))
  }

  on<K extends keyof SSEApiEventsMap>(
    event: K,
    callback: (args: SSEApiEventsMap[K]) => void
  ) {
    const listeners = this._subscriptions.get(event)

    if (!listeners) {
      this._subscriptions.set(event, [callback])
    } else {
      this._subscriptions.set(event, [...listeners, callback])
    }

    return () => {
      const filtredListeners = this._subscriptions
        .get(event)
        ?.filter((cb) => cb !== callback)

      this._subscriptions.set(event, filtredListeners)
    }
  }

  private _dispatchEvent(message: SSEApiEventSourceMessage) {
    const messageData = JSON.parse(message.data)

    if (messageData.auctionId !== this._auctionId) {
      return
    }

    switch (message.event) {
      case 'manager/new': {
        this._onNewChannel(messageData)
        break
      }
      case 'manager/get-status': {
        this._getStatus(messageData)
        break
      }
      case 'manager/status': {
        this._onStatus(messageData)
        break
      }
      case 'manager/leader-changed': {
        this._onLeaderChanged()
        break
      }
      default: {
        throw new Error('Event not found: ' + message.event)
      }
    }
  }

  private _onNewChannel(message: SSEApiEventSourceMessage) {
    try {
      this._subscriptions.get('manager/new')?.forEach((cb) => cb(message))
    } catch (err) {
      if (err instanceof Error) {
        throw err
      }

      if (err instanceof ZodError) {
        throw new Error(err.message)
      }
    }
  }

  private _onStatus(messageData: SSEApiEventsMap['manager/status']) {
    try {
      const status = z
        .object({ auctionId: z.string(), isConnected: z.boolean() })
        .parse(messageData)

      this._subscriptions.get('manager/status')?.forEach((cb) => cb(status))
    } catch (err) {
      if (err instanceof Error) {
        throw err
      }

      if (err instanceof ZodError) {
        throw new Error(err.message)
      }
    }
  }

  private _onLeaderChanged() {
    this._subscriptions.get('manager/leader-changed')?.forEach((cb) => cb())
  }

  private _getStatus(messageData: SSEApiEventsMap['manager/get-status']) {
    this._subscriptions
      .get('manager/get-status')
      ?.forEach((cb) => cb(messageData))
  }
}
