import type { ZodSchema } from 'zod'

import type {
  EventSourceMessage,
  SSEClientConnectOptions,
  SSEClientListeners,
  SSEEvents,
} from './models/base-sse-client.types'

import { BaseEmitter } from '../emitter'
import { BaseSSEClient } from './base-sse-client'
import { SSEEmiter } from './sse-emitter'

export type SSEClientOptions<EventMap extends Record<string, any>> = {
  baseMessageSchema: ZodSchema
  eventsDataSchemas?: Record<keyof EventMap, ZodSchema>
}

export class SSEClient<
  EventsMap extends Record<string, any> = Record<string, any>,
  SourceMessage extends EventSourceMessage = EventSourceMessage,
> extends BaseSSEClient {
  private readonly _sseEventsEmitter = new SSEEmiter()
  private readonly _eventsEmitter = new BaseEmitter<EventsMap>()
  private readonly _messageSchema: ZodSchema<SourceMessage>
  private readonly _eventsDataSchemas: Maybe<Partial<Record<keyof EventsMap, ZodSchema>>>

  public isConnected = false

  constructor(options: SSEClientOptions<EventsMap>) {
    super()

    const { baseMessageSchema, eventsDataSchemas } = options

    this._messageSchema = baseMessageSchema
    this._eventsDataSchemas = eventsDataSchemas
  }

  onSSEEvent<Event extends keyof SSEEvents>(
    eventName: Event,
    handler: (data: Parameters<NonNullable<SSEEvents[Event]>>[number]) => void,
  ) {
    return this._sseEventsEmitter.subscribe(eventName, handler)
  }

  onEvent<Event extends keyof EventsMap>(
    eventName: Event,
    handler: EventsMap[Event],
  ) {
    return this._eventsEmitter.on(eventName, handler)
  }

  async connectToServer(
    url: string,
    options?: SSEClientConnectOptions & { lastMessageId?: number },
  ): Promise<void> {
    const listeners: SSEClientListeners = {
      onopen: async (response) => {
        if (response.status === 200) {
          this.isConnected = true
          this._sseEventsEmitter.notify('onopen', response)
        }
      },
      onerror: (err) => {
        if (err instanceof Error) {
          this._sseEventsEmitter.notify('onerror', err)
        }
      },
      onmessage: (message) => {
        if (message.event === 'connected')
          return

        const validatedMessage = this._messageSchema.safeParse(message)
        const isMessageNotValidated = !validatedMessage.success

        if (isMessageNotValidated) {
          return this._sseEventsEmitter.notify('onerror', validatedMessage.error)
        }

        this._sseEventsEmitter.notify('onmessage', validatedMessage.data)
        this._processMesage(validatedMessage.data)
      },
      onclose: () => {
        this.isConnected = false
        this._sseEventsEmitter.notify('onclose')
      },
    }

    return this.connect(url, listeners, options)
  }

  private _processMesage(sseMessage: SourceMessage) {
    const isMessageDataSchemaExist = this._eventsDataSchemas && sseMessage.event in this._eventsDataSchemas

    try {
      if (!isMessageDataSchemaExist) {
        return
      }

      const dataSchema = this._eventsDataSchemas[sseMessage.event]
      const validatedData = dataSchema?.safeParse(JSON.parse(sseMessage.data))

      if (!validatedData?.success) {
        return this._sseEventsEmitter.notify('onerror', sseMessage)
      }

      this._eventsEmitter.emit(sseMessage.event, validatedData.data)
    }
    catch (error) {
      if (error instanceof Error)
        throw error
    }
  }
}
