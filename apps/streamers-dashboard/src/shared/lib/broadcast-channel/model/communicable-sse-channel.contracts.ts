import { z } from 'zod'

import { EventSourceMessageSchema } from '~shared/lib/fetch-event-source'

const CommunicableSourceMessageSchema = EventSourceMessageSchema.merge(
  z.object({
    event: z.literal('employee/new'),
  }),
)

export { CommunicableSourceMessageSchema }
