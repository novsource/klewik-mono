import { z } from 'zod'

import { HexColorSchema, RGBColorSchema } from '~shared/lib/zod'

const AuctionSlotSchema = z.object({
  id: z.number().nonnegative(),
  title: z.string().nonempty().max(200),
  points: z.number().nonnegative().min(1),
  color: z.union([HexColorSchema, RGBColorSchema]),
})

export default AuctionSlotSchema
