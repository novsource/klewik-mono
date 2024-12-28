import { z } from 'zod'

import { AuctionSlotSchema } from '~entities/auction-slot/model/@x/auction-slot'

import { zUnixTimestampMs } from '~shared/lib/zod'

const AuctionSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  url: z.string().url(),
  slots: AuctionSlotSchema.array(),
  dropoutSlots: AuctionSlotSchema.array(),
  wheelMode: z.enum(['classic', 'dropout']),
  isEnded: z.boolean(),
  createAt: zUnixTimestampMs,
  endedAt: zUnixTimestampMs,
})

export { AuctionSchema }
