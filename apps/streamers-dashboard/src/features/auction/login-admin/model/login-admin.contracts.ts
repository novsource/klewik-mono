import { z } from 'zod'

const loginAdminSchema = z.object({
  auctionId: z.string().uuid(),
  password: z.string().uuid(),
})

export { loginAdminSchema }
