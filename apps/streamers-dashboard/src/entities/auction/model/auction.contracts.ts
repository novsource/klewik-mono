import { z } from 'zod'

export const AuctionSchema = z.object({
  id: z.number(),
  auctionUUID: z.string().uuid(),
  ownerId: z.string().uuid(),
  slotsIds: z.number().array(),
  wheelMode: z.enum(['classic', 'dropout']),
  processedDonationsIds: z.number().array().nullable(),
  winnerSlotId: z.number().nullable(),
  dropoutSlotsIds: z.number().array(),
  isBetsClosed: z.boolean(),
  isEnded: z.boolean(),
  createAt: z.iso.datetime(),
  endedAt: z.iso.datetime().nullable(),
})
