import type { AuctionSlotsEventsCallbacks } from './auction-slots'
import type { DonationsSSEChannelEventsMap } from './donations'
import type { IntegrationsSSEEventsCallbacksMap } from './integrations/client.types'

import { SSEClient } from '~shared/lib/fetch-event-source'

import { AuctionSlotDTOSchema, AuctionSlotsEventsMessageSchema } from './auction-slots'
import { DonationsEventSourceMessageSchema, ProcessedDonationDTOSchema } from './donations'
import { IntegrationsEventSourceMessageSchema, IntegrationsSSEEventsDataSchema } from './integrations/client.contracts'

const AppSSEClientMessageSchema = AuctionSlotsEventsMessageSchema
  .extend(DonationsEventSourceMessageSchema.shape)
  .extend(IntegrationsEventSourceMessageSchema.shape)

export type AppSSEEventsCallbacks = AuctionSlotsEventsCallbacks
  & IntegrationsSSEEventsCallbacksMap
  & DonationsSSEChannelEventsMap

export const appSSEClient = new SSEClient<AppSSEEventsCallbacks>({
  baseMessageSchema: AppSSEClientMessageSchema,
  eventsDataSchemas: {
    'auction-slots/add': AuctionSlotDTOSchema.array(),
    'auction-slots/update': AuctionSlotDTOSchema,
    'donations/add': ProcessedDonationDTOSchema,
    'open': IntegrationsSSEEventsDataSchema,
    'close': IntegrationsSSEEventsDataSchema,
  },
})
