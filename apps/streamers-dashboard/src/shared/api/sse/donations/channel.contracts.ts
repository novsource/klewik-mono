import { z } from 'zod'

import { EventSourceMessageSchema } from '~shared/lib/fetch-event-source'

const DonationSchema = z.object({
  id: z.number(),
  name: z.string(),
  provider: z.enum(['donation-alerts', 'donate-pay']),
  message: z.string().max(210).nullable(),
  messageType: z.enum(['text', 'audio']),
  amount: z.number(),
  currency: z.string(),
})

const DonationsEventSourceMessageSchema = EventSourceMessageSchema.merge(
  z.object({
    event: z.literal('donations/add'),
    data: z.string().nonempty(),
  })
)

export { DonationSchema, DonationsEventSourceMessageSchema }
