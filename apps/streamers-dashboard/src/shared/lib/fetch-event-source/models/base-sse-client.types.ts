import { FetchEventSourceInit } from '@microsoft/fetch-event-source'
import { z } from 'zod'

import { EventSourceMessageSchema } from './base-sse-client.contracts'

/**
 * Base event source message
 * @link For more information: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
 */
type EventSourceMessage = z.infer<typeof EventSourceMessageSchema>

/**
 * Picked base SSE events (based on microsoft/fetch-event-source package)
 * @package microsoft/fetch-event-source
 */
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

/**
 * Basic options for connecting to server events.
 */
type SSEClientConnectOptions = FetchEventSourceInit & {
  lastMessageId?: number
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
