import { z } from 'zod'

import { FORMATTED_INTEGRATIONS_PLATFORMS_NAMES } from '~shared/constants/integrations'

import { EventSourceMessageSchema } from '~shared/lib/fetch-event-source'

export const INTEGRATIONS_SSE_NAMES = ['open', 'close']

export const IntegrationsEventSourceMessageSchema = EventSourceMessageSchema.merge(
  z.object({
    event: z.custom<`integrations/${(typeof INTEGRATIONS_SSE_NAMES)[number]}`>(
      (val) => {
        if (typeof val !== 'string')
          return false

        const events = INTEGRATIONS_SSE_NAMES.map(
          event => `integrations/${event}`,
        )

        return events.includes(val)
      },
    ),
    data: z.string().nonempty(),
  }),
)

export const IntegrationsSSEEventsDataSchema = z.object({
  integration: z.nativeEnum(FORMATTED_INTEGRATIONS_PLATFORMS_NAMES),
})
