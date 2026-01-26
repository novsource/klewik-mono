import type { ProcessedDonationDTOAction, ProcessedDonationDTOStatus } from './channel.types'

import { z } from 'zod'

import { EventSourceMessageSchema } from '~shared/lib/fetch-event-source'
import { zodEnum } from '~shared/lib/zod'

const processedDonationStatuses = [
  'added',
  'checkRequested',
  'empty',
  'error',
  'rejected',
  'inProgress',
] as const satisfies ProcessedDonationDTOStatus[]

const processedDonationAction = [
  'createSlot',
  'noAction',
  'updateSlot',
] as const satisfies ProcessedDonationDTOAction[]

const DonationSchema = z.object({
  id: z.number(),
  auctionId: z.number(),
  sourceDonationId: z.number().positive().nullable(),
  username: z.string(),
  source: z.enum(['donatePay', 'donationAlerts', 'twitch', 'userInput']),
  message: z.string().max(210).nullable(),
  messageType: z.enum(['audio', 'empty', 'text']),
  amount: z.number(),
  currency: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const ProcessedDonationDTOSchema = DonationSchema.extend({
  processData: z.object({
    action: z.enum(
      zodEnum<ProcessedDonationDTOAction>(processedDonationAction),
    ),
    slotsIds: z.number().array().nullable(),
    status: z.enum(
      zodEnum<ProcessedDonationDTOStatus>(processedDonationStatuses),
    ),
    addedPoints: z.number().nullable(),
    title: z.string().max(35).nullable(),
    donationCode: z.string().max(8).nullable(),
  }),
})

export const DonationsEventSourceMessageSchema = EventSourceMessageSchema.merge(
  z.object({
    event: z.literal('donations/add'),
    data: z.string().nonempty(),
  }),
)
