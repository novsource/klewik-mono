import type { AuctionSlotsEventsMap } from './channel.types'

import { SSEClient } from '~shared/lib/fetch-event-source'

import { AuctionSlotDTOSchema, AuctionSlotsEventsMessageSchema } from './channel.contracts'

// export const auctionSlotsSSEClient = new SpecializedSSEClient(
//   BROADCAST_CHANNEL_NAMES.AUCTION_SLOTS,
//   {
//     messageSchema: AuctionSlotsEventsMessageSchema,
//     validationEventMessage: {
//       'auction-slots/add': AuctionSlotDTOSchema,
//       'auction-slots/update': AuctionSlotDTOSchema,
//     },
//   },
// )

export const auctionSlotsSSEClient = new SSEClient<AuctionSlotsEventsMap>({
  baseMessageSchema: AuctionSlotsEventsMessageSchema,
  eventsDataSchemas: {
    'auction-slots/add': AuctionSlotDTOSchema,
    'auction-slots/update': AuctionSlotDTOSchema,
  },
})
