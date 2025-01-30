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
}

export type SSEApiEventSourceMessage = EventSourceMessage & {
  event: 'manager/new' | 'manager/status'
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

    this.postMessage({
      id: '',
      data: JSON.stringify({ auctionId }),
      event: 'manager/new',
      retry: undefined,
    })

    this.onMessage((message) => this._dispatchEvent(message))
  }

  on<K extends keyof SSEApiEventsMap>(
    event: K,
    callback: (data: SSEApiEventsMap[K]) => void
  ) {
    const listeners = this._subscriptions.get(event)

    if (!listeners) {
      this._subscriptions.set(event, [callback])
      return
    }

    this._subscriptions.set(event, [...listeners, callback])
  }

  private _dispatchEvent(message: SSEApiEventSourceMessage) {
    const messageData = JSON.parse(message.data)

    if (messageData.auctionId !== this._auctionId) {
      return
    }

    switch (message.event) {
      case 'manager/new': {
        this._onNewChannel()
        break
      }
      case 'manager/status': {
        this._onStatus(message)
        break
      }
      default: {
        throw new Error('Event not found: ' + message.event)
      }
    }
  }

  private _onNewChannel() {
    try {
      this._subscriptions.get('manager/new')?.forEach((cb) => cb())
    } catch (err) {
      if (err instanceof Error) {
        throw err
      }

      if (err instanceof ZodError) {
        throw new Error(err.message)
      }
    }
  }

  private _onStatus(message: SSEApiEventSourceMessage) {
    try {
      const messageData = JSON.parse(message.data)

      console.log('MESSAGE: ', message)
      console.log('DATA: ', messageData)
      console.log(this.isLeader)

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
}
