import { z } from 'zod'

import { CreateAuctionSchema } from './create-auction.contracts'

type CreateAuctionFormData = z.infer<typeof CreateAuctionSchema>

export type { CreateAuctionFormData }
