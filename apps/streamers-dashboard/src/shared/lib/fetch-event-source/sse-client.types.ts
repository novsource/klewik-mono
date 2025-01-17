import { FetchEventSourceInit } from '@microsoft/fetch-event-source'
import { z } from 'zod'

import { EventSourceMessageSchema } from './sse-client.contracts'

type EventSourceMessage = z.infer<typeof EventSourceMessageSchema>

type SSEEvents = Pick<
  FetchEventSourceInit,
  'onmessage' | 'onopen' | 'onerror' | 'onclose'
>

type SSEClientListeners = {
  onopen: (response: Response) => Promise<void>
  onmessage: (message: EventSourceMessage) => void
  onerror: (error: unknown) => void
  onclose: () => void
}

type SSEClientConnectOptions = FetchEventSourceInit & {
  retry?: {
    counts: number
    delay: number
  }
}

export type {
  EventSourceMessage,
  SSEEvents,
  SSEClientListeners,
  SSEClientConnectOptions,
}
