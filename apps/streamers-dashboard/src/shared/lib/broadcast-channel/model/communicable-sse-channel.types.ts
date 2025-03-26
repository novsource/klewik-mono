import { ZodSchema } from 'zod'

import { EventSourceMessage } from '~shared/lib/fetch-event-source/models'

import { BroadcastLeaderChannelOptions } from '../broadcast-leader-channel'

type CommunicableSSEChannelOptions<
  T extends Record<string, (...args: unknown[]) => void>,
> = BroadcastLeaderChannelOptions & {
  messageSchema: ZodSchema
  validationEventMessage: {
    [P in keyof T]: ZodSchema
  }
}

type CommunicableSSEChannelEventsMap = {
  'employee/new': () => void
}

type CommunicableSSEChannelMessage<SourceMessage extends EventSourceMessage> =
  EventSourceMessage & {
    event: keyof CommunicableSSEChannelEventsMap | SourceMessage['event']
  }

export type {
  CommunicableSSEChannelEventsMap,
  CommunicableSSEChannelMessage,
  CommunicableSSEChannelOptions,
}
