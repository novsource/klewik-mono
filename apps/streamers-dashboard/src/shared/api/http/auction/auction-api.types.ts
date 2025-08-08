import type { z } from 'zod'

import type { AuctionDTOSchema } from './auction-api.contracts'

export type AuctionDTO = z.infer<typeof AuctionDTOSchema>
