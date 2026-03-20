import type { z } from 'zod'

import type { AuctionSlotDTOSchema } from './auction-slots-api.contracts'

export type AuctionSlotsDTO = z.infer<typeof AuctionSlotDTOSchema>
