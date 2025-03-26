import {
  BroadcastLeaderChannelOptions,
  CommunicableSSEChannel,
} from '~shared/lib/broadcast-channel'

import {
  DonationDTOSchema,
  DonationsEventSourceMessageSchema,
} from './channel.contracts'
import {
  DonationsEventSourceMessage,
  DonationsEventsCallbacks,
} from './channel.types'

// export class DonationsBroadcastChannel extends BroadcastLeaderChannel<DonationsEventSourceMessage> {
//   private readonly _subscriptions = new Map<
//     keyof DonationsEventsMap,
//     Array<DonationsEventsCallbacks[keyof DonationsEventsMap]>
//   >([])

//   constructor(channelName: string, options?: BroadcastChannelOptions) {
//     super(channelName, options)

//     this.onMessage((message) => this._dispatchEvent(message))
//   }

//   on<K extends keyof DonationsEventsMap>(
//     event: K,
//     callback: DonationsEventsCallbacks[K]
//   ) {
//     const listeners = this._subscriptions.get(event)

//     if (!listeners) {
//       this._subscriptions.set(event, [callback])
//       return
//     }

//     this._subscriptions.set(event, [...listeners, callback])
//   }

//   emit(message: DonationsEventSourceMessage) {
//     this._dispatchEvent(message)
//   }

//   removeListener<K extends keyof DonationsEventsMap>(
//     event: K,
//     callback: (data: DonationsEventsMap[K]) => void
//   ) {
//     const listeners = this._subscriptions.get(event)

//     if (!listeners) return

//     const filtredListeners = listeners.filter((cb) => cb !== callback)

//     this._subscriptions.set(event, filtredListeners)
//   }

//   private _dispatchEvent(message: DonationsEventSourceMessage) {
//     switch (message.event) {
//       case 'donations/add': {
//         this._addDonate(message)
//         break
//       }
//       default: {
//         throw new Error('Event not found: ' + message.event)
//       }
//     }
//   }

//   private _addDonate(message: DonationsEventSourceMessage) {
//     try {
//       const data = JSON.parse(message.data)

//       if (Array.isArray(data)) {
//         throw new Error(
//           'SSE message data error: Donate is not must be array type'
//         )
//       }

//       const donation = DonationDTOSchema.parse(data)

//       this._subscriptions.get('donations/add')?.forEach((cb) => cb(donation))
//     } catch (err) {
//       if (err instanceof Error) {
//         throw err
//       }

//       if (err instanceof ZodError) {
//         throw new Error(err.message)
//       }
//     }
//   }
// }

class DonationsSSEBroadcastChannel extends CommunicableSSEChannel<
  DonationsEventSourceMessage,
  DonationsEventsCallbacks
> {
  constructor(channelName: string, options?: BroadcastLeaderChannelOptions) {
    super(channelName, {
      messageSchema: DonationsEventSourceMessageSchema,
      leaderBecomeAutomatic: false,
      validationEventMessage: {
        'donations/add': DonationDTOSchema,
      },
      ...options,
    })
  }
}

export { DonationsSSEBroadcastChannel }

const test = new DonationsSSEBroadcastChannel('test')
