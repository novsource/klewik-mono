import type {
  DonationMessageType,
  ProcessedDonationAction,
  ProcessedDonationStatus,
} from './donation.types'

import { z } from 'zod'

import { zodEnum } from '~shared/lib/zod'

export const processedDonationStatuses = [
  'added',
  'checkRequested',
  'empty',
  'error',
  'rejected',
  'inProgress',
] as const satisfies ProcessedDonationStatus[]

export const processedDonationAction = [
  'createSlot',
  'noAction',
  'updateSlot',
] as const satisfies ProcessedDonationAction[]

export const donationMessageTypes = [
  'audio',
  'empty',
  'text',
] as const satisfies DonationMessageType[]

export const DonationSchema = z.object({
  id: z.number(),
  auctionId: z.number(),
  sourceDonationId: z.number().positive().nullable(),
  username: z.string(),
  source: z.enum(['donatePay', 'donationAlerts', 'twitch', 'userInput']),
  message: z.string().max(210).nullable(),
  messageType: z.enum(['audio', 'empty', 'text']),
  amount: z.number(),
  currency: z.string(),
  createdAt: z.string().date(),
  updatedAt: z.string().date(),
})

export const ProcessedDonationSchema = DonationSchema.extend({
  processData: z.object({
    action: z.enum(
      zodEnum<ProcessedDonationAction>(processedDonationAction),
    ),
    slotsIds: z.number().array().nullable(),
    status: z.enum(
      zodEnum<ProcessedDonationStatus>(processedDonationStatuses),
    ),
    addedPoints: z.number().nullable(),
    title: z.string().max(40).nullable(),
    donationCode: z.string().max(8).nullable(),
  }),
})

export const DonationCodeSchema = z.object({
  id: z.number(),
  auctionId: z.number(),
  title: z.string(),
  code: z.string().length(8),
  slotId: z.number().nullable(),
  createdAt: z.string(),
})
