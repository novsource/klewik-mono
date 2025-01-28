import { BroadcastChannelOptions } from 'broadcast-channel'
import { ZodError } from 'zod'

import { BroadcastLeaderChannel } from '~shared/lib/broadcast-channel'

import { getRandomHEXColor } from '~shared/utils/colors'

import { AuctionSlotDTOSchema } from './channel.contracts'
import {
  AuctionEventSourceMessage,
  AuctionSlotsEventsMap,
} from './channel.types'

export class AuctionSlotsBroadcastChannel extends BroadcastLeaderChannel<AuctionEventSourceMessage> {
  private readonly _subscriptions = new Map<
    keyof AuctionSlotsEventsMap,
    Array<(data: any) => void>
  >([])

  constructor(channelName: string, options?: BroadcastChannelOptions) {
    super(channelName, options)

    this.onMessage((message) => this._dispatchEvent(message))
  }

  on<K extends keyof AuctionSlotsEventsMap>(
    event: K,
    callback: (data: AuctionSlotsEventsMap[K]) => void
  ) {
    const listeners = this._subscriptions.get(event) as
      | Array<(data: AuctionSlotsEventsMap[K]) => void>
      | undefined

    if (!listeners) {
      this._subscriptions.set(event, [callback])
      return
    }

    this._subscriptions.set(event, [...listeners, callback])
  }

  emit(message: AuctionEventSourceMessage) {
    this._dispatchEvent(message)
  }

  private _dispatchEvent(message: AuctionEventSourceMessage) {
    switch (message.event) {
      case 'auction-slots/add': {
        this._addingSlots(message)
        break
      }
      default: {
        throw new Error('Event not found: ' + message.event)
      }
    }
  }

  private _addingSlots(message: AuctionEventSourceMessage) {
    try {
      const data = JSON.parse(message.data)

      if (!Array.isArray(data)) {
        throw new Error(
          'SSE message data error: Auction slots must be array type'
        )
      }

      const parseResult = data.reduce<
        AuctionSlotsEventsMap['auction-slots/add']
      >((acc, item) => {
        const itemForParse = { ...item, color: getRandomHEXColor() }
        const result = AuctionSlotDTOSchema.parse(itemForParse)

        acc.push(result)

        return acc
      }, [])

      this._subscriptions
        .get('auction-slots/add')
        ?.forEach((cb) => cb(parseResult))
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
