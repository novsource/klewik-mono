import { z } from 'zod'

import { HexColorSchema, RGBColorSchema } from '~shared/lib/zod'

const AuctionSlotSchema = z.object({
  id: z.number().nonnegative(),
  name: z.string().nonempty().max(200),
  points: z.number().nonnegative(),
  color: z.union([HexColorSchema, RGBColorSchema]),
})

export default AuctionSlotSchema
