import { z } from 'zod'

import AuctionSlotContract from './auction-slot.contracts'

type AuctionSlot = z.infer<typeof AuctionSlotContract>

export default AuctionSlot
