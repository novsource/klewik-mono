import { z } from 'zod'

import { UnixTimestampInMsSchema } from '~shared/lib/zod'

const AuctionSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  url: z.string().url(),
  wheelMode: z.enum(['classic', 'dropout']),
  isBetsClosed: z.boolean(),
  isEnded: z.boolean(),
  createAt: UnixTimestampInMsSchema,
  endedAt: UnixTimestampInMsSchema,
})

export { AuctionSchema }
