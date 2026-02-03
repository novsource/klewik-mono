import z from 'zod'

import { HexColorSchema } from '~shared/lib/zod'

export const CardsGameUnitSchema = z.object({
  id: z.number().nonnegative().min(1),
  auctionSlotId: z.number(),
  title: z.string(),
  color: HexColorSchema,
  bgImageUrl: z.url(),
})
