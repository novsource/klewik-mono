import type { z } from 'zod'

import type { AuctionSchema } from './auction.contracts'

export type Auction = z.infer<typeof AuctionSchema>
