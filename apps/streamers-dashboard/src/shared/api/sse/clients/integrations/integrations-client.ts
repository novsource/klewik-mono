import type { IntegrationsSSEEventsMap } from './client.types'

import { SSEClient } from '~shared/lib/fetch-event-source'

import { IntegrationsEventSourceMessageSchema, IntegrationsSSEEventsDataSchema } from './client.contracts'

export const integrationsSSEClient = new SSEClient<IntegrationsSSEEventsMap>({
  baseMessageSchema: IntegrationsEventSourceMessageSchema,
  eventsDataSchemas: {
    open: IntegrationsSSEEventsDataSchema,
    close: IntegrationsSSEEventsDataSchema,
  },
})
