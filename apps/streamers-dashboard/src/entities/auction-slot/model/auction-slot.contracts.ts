import { z } from 'zod'

import { zHexColor, zRGBColor } from '~shared/lib/zod'

const AuctionSlotContract = z.object({
  id: z.number().nonnegative(),
  name: z.string().nonempty(),
  points: z.number().nonnegative(),
  color: z.union([zRGBColor, zHexColor]),
})

export default AuctionSlotContract
