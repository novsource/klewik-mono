import { z } from 'zod'

export const AuctionSlotDTOSchema = z.object({
  id: z.number().nonnegative(),
  auctionSlotOrder: z.number().nonnegative(),
  title: z.string().nonempty().max(200),
  points: z.number().nonnegative().min(1),
})
