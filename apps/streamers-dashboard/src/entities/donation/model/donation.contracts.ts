import { z } from 'zod'

import { UnixTimestampInMsSchema } from '~shared/lib/zod'

const DonationSchema = z.object({
  id: z.number(),
  username: z.string(),
  provider: z.enum(['donation-alerts', 'donate-pay']),
  message: z.string().max(210).nullable(),
  message_type: z.enum(['text', 'audio']),
  amount: z.number(),
  currency: z.string(),
  createdAt: UnixTimestampInMsSchema.optional(),
})

const ProcessedDonationSchema = DonationSchema.extend({
  processingStatus: z.enum(['added', 'empty', 'error', 'confirm']),
  reason: z.string().optional(),
})

export { DonationSchema, ProcessedDonationSchema }
