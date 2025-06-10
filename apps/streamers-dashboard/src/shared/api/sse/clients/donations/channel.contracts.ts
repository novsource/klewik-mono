import { z } from 'zod'

import { EventSourceMessageSchema } from '~shared/lib/fetch-event-source'

const DonationDTOSchema = z.object({
  id: z.number(),
  auctionUUID: z.string().uuid(),
  sourceDonationId: z.number().positive().nullable(),
  username: z.string(),
  source: z.enum(['donatePay', 'donationAlerts', 'twitch', 'userInput']),
  message: z.string().max(210).nullable(),
  messageType: z.enum(['audio', 'empty', 'text']),
  amount: z.number(),
  currency: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  processedAction: z.enum(['createSlot', 'noAction', 'updateSlot']),
  processedSlotsIds: z.number().array().nullable(),
  processedStatus: z.enum([
    'added',
    'checkRequested',
    'empty',
    'error',
    'rejected',
    'inProgress',
  ]),
})

const DonationsEventSourceMessageSchema = EventSourceMessageSchema.merge(
  z.object({
    event: z.literal('donations/add'),
    data: z.string().nonempty(),
  })
)

export { DonationDTOSchema, DonationsEventSourceMessageSchema }
