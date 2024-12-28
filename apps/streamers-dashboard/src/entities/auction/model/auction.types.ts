import { z } from 'zod'

import { AuctionSchema } from './auction.contracts'

export type Auction = z.infer<typeof AuctionSchema>
