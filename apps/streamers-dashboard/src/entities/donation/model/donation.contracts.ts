import { z } from 'zod'

import { zodEnum } from '~shared/lib/zod'

import {
  DonationMessageType,
  ProcessedDonationAction,
  ProcessedDonationStatus,
} from './donation.types'

const processedDonationStatuses = [
  'added',
  'checkRequested',
  'empty',
  'error',
  'rejected',
  'inProgress',
] as const satisfies ProcessedDonationStatus[]

const processedDonationAction = [
  'createSlot',
  'noAction',
  'updateSlot',
] as const satisfies ProcessedDonationAction[]

const donationMessageTypes = [
  'audio',
  'empty',
  'text',
] as const satisfies DonationMessageType[]

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

const ProcessedDonationSchema = DonationSchema.extend({
  processedAction: z.enum(
    zodEnum<ProcessedDonationAction>(processedDonationAction)
  ),
  processedSlotsIds: z.number().array().nullable(),
  processedStatus: z.enum(
    zodEnum<ProcessedDonationStatus>(processedDonationStatuses)
  ),
})

export {
  DonationSchema,
  ProcessedDonationSchema,
  processedDonationAction,
  processedDonationStatuses,
  donationMessageTypes,
}
