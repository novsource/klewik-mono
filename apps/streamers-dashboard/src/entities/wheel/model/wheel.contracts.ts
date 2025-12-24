import { z } from 'zod'

import { AuctionSlotSchema } from '~entities/auction-slot/model/@x/auction-slot'

import { HexColorSchema, RGBColorSchema } from '~shared/lib/zod'

export const WheelSlotSchema = z
  .object({
    color: z.union([HexColorSchema, RGBColorSchema]),
    startAngle: z.number().min(0).max(360),
    endAngle: z.number().min(0).max(361),
  })
  .merge(AuctionSlotSchema)
