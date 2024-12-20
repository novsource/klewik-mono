import { z } from 'zod'

import { AuctionSlotContract } from '~entities/auction-slot/model/@x/auction-slot'

const WheelSlotContract = z
  .object({
    startAngle: z.number().positive().max(6),
    endAngle: z.number().positive().max(6),
  })
  .merge(AuctionSlotContract)

export { WheelSlotContract }
