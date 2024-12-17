import { z } from 'zod'

import { AuctionContract } from './auction.contracts'

export type Auction = z.infer<typeof AuctionContract>
