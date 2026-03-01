import { z } from 'zod'

export const AuctionDTOSchema = z.object({
  id: z.number(),
  auctionUUID: z.string().uuid(),
  ownerId: z.string().uuid(),
  slotsIds: z.number().array(),
  url: z.string().url(),
  wheelMode: z.enum(['classic', 'dropout']),
  processedDonationsIds: z.number().array().nullable(),
  winnerSlotId: z.number().nullable(),
  dropoutSlotsIds: z.number().array(),
  isBetsClosed: z.boolean(),
  isEnded: z.boolean(),
  createdAt: z.string().date(),
  endedAt: z.string().date(),
})
