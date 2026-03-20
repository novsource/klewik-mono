import type { z } from 'zod'

import type { IntegrationsEventSourceMessageSchema, IntegrationsSSEEventsDataSchema } from './client.contracts'

export type IntegrationsEventSourceMessage = z.infer<typeof IntegrationsEventSourceMessageSchema>

export type IntegrationsSSEEventsMap = {
  open: z.infer<typeof IntegrationsSSEEventsDataSchema>
  close: z.infer<typeof IntegrationsSSEEventsDataSchema>
}

export type IntegrationsSSEEventsCallbacksMap = {
  open: (data: z.infer<typeof IntegrationsSSEEventsDataSchema>) => void
  close: (data: z.infer<typeof IntegrationsSSEEventsDataSchema>) => void
}
