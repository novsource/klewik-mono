import type { AuctionSlotsEventsCallbacks } from './channel.types'

import { SSEClient } from '~shared/lib/fetch-event-source'

import { AuctionSlotDTOSchema, AuctionSlotsEventsMessageSchema } from './channel.contracts'

export const auctionSlotsSSEClient = new SSEClient<AuctionSlotsEventsCallbacks>({
  baseMessageSchema: AuctionSlotsEventsMessageSchema,
  eventsDataSchemas: {
    'auction-slots/add': AuctionSlotDTOSchema.array(),
    'auction-slots/update': AuctionSlotDTOSchema,
  },
})
