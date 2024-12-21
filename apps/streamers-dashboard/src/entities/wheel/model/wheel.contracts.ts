import { z } from 'zod'

import { AuctionSlotContract } from '~entities/auction-slot/model/@x/auction-slot'

const WheelSlotContract = z
  .object({
    startAngle: z.number().min(0).max(360),
    endAngle: z.number().min(0).max(360),
  })
  .merge(AuctionSlotContract)

export { WheelSlotContract }
