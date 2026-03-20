import type { BroadcastChannelOptions } from 'broadcast-channel'

import { z } from 'zod'

import { CommunicableSSEChannel } from '~shared/lib/broadcast-channel'
import { EventSourceMessageSchema } from '~shared/lib/fetch-event-source'

type SSEClientsManagerEventsMap = {
  'manager/new': (data: { auctionId: string }) => void
  'manager/status': (data: { auctionId: string, isConnected: boolean }) => void
  'manager/leader-changed': (data: { auctionId: string }) => void
  'manager/get-status': (data: { auctionId: string }) => void
}

const SSEClientsManagerSourceMessageSchema = EventSourceMessageSchema.merge(
  z.object({
    event: z.enum([
      'manager/new',
      'manager/status',
      'manager/leader-changed',
      'manager/get-status',
    ]),
  }),
)

export type SSEApiEventSourceMessage = z.infer<
  typeof SSEClientsManagerSourceMessageSchema
>

type SSEApiBroadcastChannelOptions = Partial<BroadcastChannelOptions> & {
  auctionId: string
}

export class SSEClientsManagerBroadcastChannel extends CommunicableSSEChannel<
  SSEApiEventSourceMessage,
  SSEClientsManagerEventsMap
> {
  constructor(channelName: string, options: SSEApiBroadcastChannelOptions) {
    super(channelName, {
      messageSchema: SSEClientsManagerSourceMessageSchema,
      validationEventMessage: {
        'manager/get-status': z.object({ auctionId: z.string().uuid() }),
        'manager/leader-changed': z.object({ auctionId: z.string().uuid() }),
        'manager/status': z.object({
          auctionId: z.string().uuid(),
          isConnected: z.boolean(),
        }),
        'manager/new': z.object({ auctionId: z.string().uuid() }),
      },
      ...options,
    })
  }
}
