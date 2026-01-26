import { z } from 'zod'

const AuctionSlotSchema = z.object({
  id: z.number().nonnegative(),
  auctionSlotOrder: z.number().nonnegative(),
  title: z.string().min(3).max(35),
  points: z.number().nonnegative().min(1),
})

export default AuctionSlotSchema
