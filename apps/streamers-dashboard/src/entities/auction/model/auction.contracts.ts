import { z } from 'zod'

const AuctionSchema = z.object({
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
  createAt: z.date().transform((value) => {
    if (value instanceof Date) {
      return value.toISOString()
    }
  }),
  endedAt: z.date().transform((value) => {
    if (value instanceof Date) {
      return value.toISOString()
    }
  }),
})

export { AuctionSchema }
