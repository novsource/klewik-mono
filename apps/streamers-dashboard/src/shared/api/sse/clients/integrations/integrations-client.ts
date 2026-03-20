import type { IntegrationsSSEEventsCallbacksMap } from './client.types'

import { SSEClient } from '~shared/lib/fetch-event-source'

import { IntegrationsEventSourceMessageSchema, IntegrationsSSEEventsDataSchema } from './client.contracts'

export const integrationsSSEClient = new SSEClient<IntegrationsSSEEventsCallbacksMap>({
  baseMessageSchema: IntegrationsEventSourceMessageSchema,
  eventsDataSchemas: {
    open: IntegrationsSSEEventsDataSchema,
    close: IntegrationsSSEEventsDataSchema,
  },
})
