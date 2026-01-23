import { z } from 'zod'

export const loginAdminSchema = z.object({
  auctionUUID: z.string().uuid(),
  password: z.string().uuid(),
})
