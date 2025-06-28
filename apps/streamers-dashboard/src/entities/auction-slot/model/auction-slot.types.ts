import type { z } from 'zod'

import type AuctionSlotSchema from './auction-slot.contracts'

type AuctionSlot = z.infer<typeof AuctionSlotSchema>

export default AuctionSlot
