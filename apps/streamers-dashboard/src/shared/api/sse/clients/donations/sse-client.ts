import type { DonationsSSEChannelEventsMap } from './channel.types'

import { SSEClient } from '~shared/lib/fetch-event-source'

import { DonationsEventSourceMessageSchema, ProcessedDonationDTOSchema } from './channel.contracts'

// export const donationsSSEClient = new SpecializedSSEClient(
//   BROADCAST_CHANNEL_NAMES.DONATIONS,
//   {
//     messageSchema: DonationsEventSourceMessageSchema,
//     validationEventMessage: { 'donations/add': ProcessedDonationDTOSchema },
//   },
// )

export const donationsSSEClient = new SSEClient<DonationsSSEChannelEventsMap>({
  baseMessageSchema: DonationsEventSourceMessageSchema,
  eventsDataSchemas: {
    'donations/add': ProcessedDonationDTOSchema.array(),
  },
})
