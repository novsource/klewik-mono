import type { ZodType } from 'zod'

import type {
  EventSourceMessage,
  SSEClientConnectOptions,
  SSEClientListeners,
  SSEEvents,
} from './models/base-sse-client.types'

import { BaseEmitter } from '../emitter'
import { BaseSSEClient } from './base-sse-client'
import { SSEEmiter } from './sse-emitter'

export type SSEClientOptions<SourceMessage extends EventSourceMessage = EventSourceMessage, EventMap extends Record<string, any> = Record<string, any>> = {
  baseMessageSchema: ZodType<SourceMessage>
  eventsDataSchemas?: Record<keyof EventMap, ZodType>
}

export class SSEClient<
  EventsMap extends Record<string, any> = Record<string, any>,
  SourceMessage extends EventSourceMessage = EventSourceMessage,
> extends BaseSSEClient {
  private readonly _sseEventsEmitter = new SSEEmiter()
  private readonly _eventsEmitter = new BaseEmitter<EventsMap>()
  private readonly _messageSchema: ZodType<SourceMessage>
  private readonly _eventsDataSchemas: Maybe<Partial<Record<keyof EventsMap, ZodType>>>

  public isConnected = false

  constructor(options: SSEClientOptions<SourceMessage, EventsMap>) {
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
    const defaultListeners: SSEClientListeners = {
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
      onmessage: (rawMessage) => {
        if (rawMessage.event === 'connected')
          return

        const validateMessageResults = this._messageSchema.safeParse(rawMessage)
        const isMessageNotValid = !validateMessageResults.success

        if (isMessageNotValid) {
          return this._sseEventsEmitter.notify('onerror', validateMessageResults.error)
        }

        const message = validateMessageResults.data

        this._sseEventsEmitter.notify('onmessage', message)
        this._processMessage(message)
      },
      onclose: () => {
        this.isConnected = false
        this._sseEventsEmitter.notify('onclose')
      },
    }

    return this.connect(url, defaultListeners, options)
  }

  private _processMessage(message: SourceMessage) {
    const isMessageDataSchemaExist = this._eventsDataSchemas && Reflect.has(this._eventsDataSchemas, message.event)
    if (!isMessageDataSchemaExist) {
      return
    }

    const event = message.event as keyof EventsMap
    const validateSchemaForEventData = this._eventsDataSchemas[event]!

    try {
      const parsedData: unknown = JSON.parse(message.data)
      const validatedData = validateSchemaForEventData.safeParse(parsedData)

      if (!validatedData.success) {
        return this._sseEventsEmitter.notify('onerror', message)
      }

      this._eventsEmitter.emit(event, validatedData.data)
    }
    catch (error) {
      if (error instanceof Error)
        throw error
    }
  }
}
