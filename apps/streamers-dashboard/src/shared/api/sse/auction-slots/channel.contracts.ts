import { z } from 'zod'

import { EventSourceMessageSchema } from '~shared/lib/fetch-event-source'
import { HexColorSchema, RGBColorSchema } from '~shared/lib/zod'

const AuctionSlotDTOSchema = z.object({
  id: z.number().nonnegative(),
  name: z.string().nonempty().max(200),
  points: z.number().nonnegative(),
  color: z.union([HexColorSchema, RGBColorSchema]),
})

const AuctionSlotsEvents = ['add', 'update'] as const

const AuctionSlotsEventsMessageSchema = EventSourceMessageSchema.merge(
  z.object({
    event: z.custom<`auction-slots/${(typeof AuctionSlotsEvents)[number]}`>(
      (val) => {
        return AuctionSlotsEvents.includes(val)
      }
    ),
    data: z.string().nonempty(),
  })
)

export { AuctionSlotDTOSchema, AuctionSlotsEventsMessageSchema }
