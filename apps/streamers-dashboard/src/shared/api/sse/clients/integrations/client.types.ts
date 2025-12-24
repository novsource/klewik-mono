import type { z } from 'zod'

import type { IntegrationsEventSourceMessageSchema, IntegrationsSSEEventsDataSchema } from './client.contracts'

export type IntegrationsEventSourceMessage = z.infer<typeof IntegrationsEventSourceMessageSchema>

export type IntegrationsSSEEventsMap = {
  open: z.infer<typeof IntegrationsSSEEventsDataSchema>
  close: z.infer<typeof IntegrationsSSEEventsDataSchema>
}

export type IntegrationsSSEEventsCallbacksMap = {
  open: () => void
  close: () => void
}
