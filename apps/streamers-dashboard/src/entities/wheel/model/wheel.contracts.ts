import { z } from 'zod'

import { AuctionSlotSchema } from '~entities/auction-slot/model/@x/auction-slot'

const WheelSlotSchema = z
  .object({
    startAngle: z.number().min(0).max(360),
    endAngle: z.number().min(0).max(360),
  })
  .merge(AuctionSlotSchema)

export { WheelSlotSchema }
