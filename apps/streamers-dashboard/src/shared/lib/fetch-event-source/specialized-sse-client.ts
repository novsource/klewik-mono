import { BroadcastChannelOptions } from 'broadcast-channel'
import { ZodSchema } from 'zod'

import { BroadcastLeaderChannel } from '../broadcast-channel'
import { BaseSSEClient } from './base-sse-client'
import { EventSourceMessage, SSEEvents } from './models/base-sse-client.types'
import { SSEEmiter } from './sse-emitter'

type SpecializedSSEClientOptions<
  T extends Record<string, (...args: unknown[]) => void>,
> = BroadcastChannelOptions & {
  messageSchema: ZodSchema
  validationEventMessage?: {
    [P in keyof T]?: ZodSchema
  }
}

class SpecializedSSEClient<
  SourceMessage extends EventSourceMessage,
  ChannelEvents extends Record<string, (...args: unknown[]) => void>,
> extends BaseSSEClient {
  private readonly _broadcastChannel: BroadcastLeaderChannel<
    SourceMessage,
    ChannelEvents
  >
  private readonly _emitter = new SSEEmiter()

  constructor(
    channelName: string,
    {
      messageSchema,
      validationEventMessage,
      ...channelOptions
    }: SpecializedSSEClientOptions<ChannelEvents>
  ) {
    super()

    this._broadcastChannel = new BroadcastLeaderChannel<
      SourceMessage,
      ChannelEvents
    >(channelName, channelOptions)
  }

  get channel() {
    return this._broadcastChannel
  }

  on<Event extends keyof SSEEvents>(
    eventName: Event,
    callback: (data: Parameters<NonNullable<SSEEvents[Event]>>[number]) => void
  ) {
    this._emitter.subscribe(eventName, callback)
  }
}

export { SpecializedSSEClient }
