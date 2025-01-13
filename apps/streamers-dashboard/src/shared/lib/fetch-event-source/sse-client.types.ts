import { FetchEventSourceInit } from '@microsoft/fetch-event-source'
import { z } from 'zod'

import { EventSourceMessageSchema } from './sse-client.contracts'

type EventSourceMessage = z.infer<typeof EventSourceMessageSchema>

type SSEEvents = Pick<
  FetchEventSourceInit,
  'onmessage' | 'onopen' | 'onerror' | 'onclose'
>

export type { EventSourceMessage, SSEEvents }
