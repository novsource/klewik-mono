import { z } from 'zod'

import { AuctionSlotContract } from '~entities/auction-slot/model/@x/auction-slot'

import { zUnixTimestampMs } from '~shared/lib/zod'

const AuctionContract = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  url: z.string().url(),
  slots: AuctionSlotContract.array(),
  dropoutSlots: AuctionSlotContract.array(),
  wheelMode: z.enum(['classic', 'dropout']),
  isEnded: z.boolean(),
  createAt: zUnixTimestampMs,
  endedAt: zUnixTimestampMs,
})

export { AuctionContract }
