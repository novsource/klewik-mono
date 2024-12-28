import { z } from 'zod'

import AuctionSlotSchema from './auction-slot.contracts'

type AuctionSlot = z.infer<typeof AuctionSlotSchema>

export default AuctionSlot
