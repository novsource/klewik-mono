import { z } from 'zod'

import { EventSourceMessageSchema } from '~shared/lib/fetch-event-source'

const AuctionSlotDTOSchema = z.object({
  id: z.number().nonnegative(),
  title: z.string().nonempty().max(200),
  auctionSlotOrder: z.number().nonnegative(),
  points: z.number().nonnegative(),
  isAlived: z.boolean(),
  isDropped: z.boolean(),
})

const AuctionSlotsEvents = ['add', 'update'] as const

const AuctionSlotsEventsMessageSchema = EventSourceMessageSchema.merge(
  z.object({
    event: z.custom<`auction-slots/${(typeof AuctionSlotsEvents)[number]}`>(
      (val) => {
        if (typeof val !== 'string')
          return false

        const events = AuctionSlotsEvents.map(
          event => `auction-slots/${event}`,
        )

        return events.includes(val)
      },
    ),
    data: z.string().nonempty(),
  }),
)

export { AuctionSlotDTOSchema, AuctionSlotsEventsMessageSchema }
