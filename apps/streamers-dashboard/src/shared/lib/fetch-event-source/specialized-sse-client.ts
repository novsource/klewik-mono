// import type { ZodSchema } from 'zod'

// import type { CommunicableSSEChannelOptions } from '../broadcast-channel/model'
// import type {
//   EventSourceMessage,
//   SSEClientConnectOptions,
//   SSEClientListeners,
//   SSEEvents,
// } from './models/base-sse-client.types'

// import { CommunicableSSEChannel } from '../broadcast-channel'
// import { BaseSSEClient } from './base-sse-client'
// import { SSEEmiter } from './sse-emitter'

// export class SpecializedSSEClient<
//   SourceMessage extends EventSourceMessage = EventSourceMessage,
//   EventsMap extends Record<string, any> = Record<string, any>,
// > extends BaseSSEClient {
//   private readonly _sseEventsEmitter = new SSEEmiter()
//   private readonly _messageSchema: ZodSchema
//   public readonly broadcastChannel: CommunicableSSEChannel<
//     SourceMessage,
//     EventsMap
//   >

//   public isConnected = false

//   constructor(
//     channelName: string,
//     channelOptions: CommunicableSSEChannelOptions<EventsMap>,
//   ) {
//     super()

//     this._messageSchema = channelOptions.messageSchema

//     this.broadcastChannel = new CommunicableSSEChannel<
//       SourceMessage,
//       EventsMap
//     >(channelName, channelOptions)
//   }

//   onSSEEvent<Event extends keyof SSEEvents>(
//     eventName: Event,
//     handler: (data: Parameters<NonNullable<SSEEvents[Event]>>[number]) => void,
//   ) {
//     this._sseEventsEmitter.subscribe(eventName, handler)
//   }

//   onEvent<Event extends keyof EventsMap>(
//     eventName: Event,
//     handler: EventsMap[Event],
//   ) {
//     this.broadcastChannel.on(eventName, handler)
//   }

//   async connectToServer(
//     url: string,
//     options?: SSEClientConnectOptions & { lastMessageId?: number },
//   ): Promise<void> {
//     const listeners: SSEClientListeners = {
//       onopen: async (response) => {
//         if (response.status === 200) {
//           this.isConnected = true
//           this._sseEventsEmitter.notify('onopen', response)
//         }
//       },
//       onerror: (err) => {
//         if (err instanceof Error) {
//           this._sseEventsEmitter.notify('onerror', err)
//           throw err
//         }
//       },
//       onmessage: (message) => {
//         if (message.event === 'connected')
//           return

//         const parsedMessage = this._messageSchema.safeParse(message)

//         if (
//           parsedMessage.data === undefined
//           || parsedMessage.error
//           || !parsedMessage.success
//         ) {
//           return this._sseEventsEmitter.notify('onerror', parsedMessage.error)
//         }

//         this._sseEventsEmitter.notify('onmessage', parsedMessage.data)

//         if (this.broadcastChannel.isLeader) {
//           this.broadcastChannel.processCustomEventMessage(message)
//           this.broadcastChannel.postMessage(parsedMessage.data)
//         }
//       },
//       onclose: () => {
//         this.isConnected = false
//         this._sseEventsEmitter.notify('onclose')
//       },
//     }

//     return this.connect(url, listeners, {
//       retry: { counts: 5, delay: 1000 },
//       ...options,
//     }).catch((err) => {
//       throw err
//     })
//   }
// }
