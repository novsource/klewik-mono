import type { ProcessedDonationDTOAction, ProcessedDonationDTOStatus } from './donations-api.types'

import { z } from 'zod'

import { integrationsPlatforms } from '~shared/constants/integrations'

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

const DonationDTOSchema = z.object({
  id: z.number(),
  auctionId: z.number(),
  sourceDonationId: z.number().positive().nullable(),
  username: z.string(),
  source: z.enum(integrationsPlatforms),
  message: z.string().max(210).nullable(),
  messageType: z.enum(['audio', 'empty', 'text']),
  amount: z.number(),
  currency: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const ProcessedDonationDTOSchema = DonationDTOSchema.extend({
  processData: z.object({
    action: z.enum(
      zodEnum<ProcessedDonationDTOAction>(processedDonationAction),
    ),
    slotsIds: z.number().array().nullable(),
    status: z.enum(
      zodEnum<ProcessedDonationDTOStatus>(processedDonationStatuses),
    ),
    addedPoints: z.number().nullable(),
    title: z.string().max(40).nullable(),
    donationCode: z.string().max(8).nullable(),
  }),
})

export const DonationCodeDTOSchema = z.object({
  id: z.number(),
  auctionId: z.number(),
  title: z.string(),
  code: z.string().length(8),
  slotId: z.number().nullable(),
  createdAt: z.iso.datetime(),
  isUsed: z.boolean(),
})
