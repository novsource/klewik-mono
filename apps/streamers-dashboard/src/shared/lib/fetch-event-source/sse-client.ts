import type { ZodType } from 'zod'

import type {
  EventSourceMessage,
  SSEClientConnectOptions,
  SSEClientListeners,
  SSEEvents,
} from './models/base-sse-client.types'

import { isError } from '~shared/utils'

import { BaseEmitter } from '../emitter'
import { BaseSSEClient } from './base-sse-client'
import { SSEEmiter } from './sse-emitter'

export type SSEClientOptions<
  SourceMessage extends EventSourceMessage = EventSourceMessage,
  EventsMap extends Record<string, any> = Record<string, any>,
> = {
  baseMessageSchema: ZodType<SourceMessage>
  eventsDataSchemas: {
    [Event in keyof EventsMap]: ZodType<Parameters<EventsMap[Event]>[0]>
  }
}

export class SSEClient<
  EventsMap extends Record<string, any> = Record<string, any>,
  SourceMessage extends EventSourceMessage = EventSourceMessage,
> extends BaseSSEClient {
  private readonly _sseBaseEventsEmitter = new SSEEmiter()
  private readonly _clientCustomEventsEmitter = new BaseEmitter<EventsMap>()
  private readonly _messageSchema: ZodType<SourceMessage>
  // private readonly _eventsDataSchemas: Record<keyof EventsMap, ZodType<EventsMap[keyof EventsMap]>>
  private readonly _eventsDataSchemas: {
    [Event in keyof EventsMap]: ZodType<Parameters<EventsMap[Event]>[0]>
  }

  public isConnected = false

  constructor(options: SSEClientOptions<SourceMessage, EventsMap>) {
    super()

    const { baseMessageSchema, eventsDataSchemas } = options

    this._messageSchema = baseMessageSchema
    this._eventsDataSchemas = eventsDataSchemas
  }

  onSSEEvent<Event extends keyof SSEEvents>(
    eventName: Event,
    handler: (data: NonNullable<SSEEvents[Event]>) => void,
  ) {
    return this._sseBaseEventsEmitter.subscribe(eventName, handler)
  }

  onEvent<Event extends keyof EventsMap>(
    eventName: Event,
    handler: EventsMap[Event],
  ) {
    return this._clientCustomEventsEmitter.on(eventName, handler)
  }

  async connectToServer(
    url: string,
    options?: SSEClientConnectOptions & { lastMessageId?: number },
  ): Promise<void> {
    const defaultListeners: SSEClientListeners = {
      onopen: async (response) => {
        if (response.status === 200) {
          this.isConnected = true
          this._sseBaseEventsEmitter.notify('onopen', response)
        }
      },
      onerror: (err) => {
        if (err instanceof Error) {
          this._sseBaseEventsEmitter.notify('onerror', err)
        }
      },
      onmessage: (rawMessage) => {
        if (rawMessage.event === 'connected')
          return

        const validateMessageResults = this._messageSchema.safeParse(rawMessage)
        const isMessageNotValid = !validateMessageResults.success

        if (isMessageNotValid) {
          return this._sseBaseEventsEmitter.notify('onerror', validateMessageResults.error)
        }

        const message = validateMessageResults.data

        this._sseBaseEventsEmitter.notify('onmessage', message)
        this._processMessage(message)
      },
      onclose: () => {
        this.isConnected = false
        this._sseBaseEventsEmitter.notify('onclose')
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
    const validateSchemaForEventData = this._eventsDataSchemas[event]

    try {
      const deserializedMessageData = JSON.parse(message.data)
      const validatedMessageDataResult = validateSchemaForEventData.safeParse(deserializedMessageData)

      if (!validatedMessageDataResult.success) {
        this._sseBaseEventsEmitter.notify('onerror', message)
        return
      }

      this._clientCustomEventsEmitter.emit(event, validatedMessageDataResult.data as EventsMap[typeof event])
    }
    catch (error) {
      if (isError(error)) {
        this._sseBaseEventsEmitter.notify('onerror', message)
      }
    }
  }
}
