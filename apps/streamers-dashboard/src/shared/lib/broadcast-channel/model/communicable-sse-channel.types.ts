import type { ZodType } from 'zod'

import type { BroadcastLeaderChannelOptions } from '../broadcast-leader-channel'

import type { EventSourceMessage } from '~shared/lib/fetch-event-source/models'

export type CommunicableSSEChannelOptions<
  SourceMessage extends EventSourceMessage,
  EventsMap extends Record<string, any>,
> = BroadcastLeaderChannelOptions & {
  messageSchema: ZodType<SourceMessage>
  validationEventMessage: {
    [Event in keyof EventsMap]: ZodType<EventsMap[Event]>
  }
}

export type CommunicableSSEChannelDefaultEventsMap = {
  'employee/new': null
}

export type CommunicableSSEChannelMessage<SourceMessage extends EventSourceMessage>
  = {
    id: string
    data: string
    event: SourceMessage['event'] | keyof CommunicableSSEChannelDefaultEventsMap
  }
