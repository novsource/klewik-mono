import type { z } from 'zod'

import type {
  AuctionSlotDTOSchema,
  AuctionSlotsEventsMessageSchema,
} from './channel.contracts'

export type AuctionSlotDTO = z.infer<typeof AuctionSlotDTOSchema>

export type AuctionSlotsEventSourceMessage = z.infer<typeof AuctionSlotsEventsMessageSchema>

export type AuctionSlotsEventsMap = {
  'auction-slots/add': AuctionSlotDTO[]
  'auction-slots/update': AuctionSlotDTO
}

export type AuctionSlotsEventsCallbacks = {
  [Event in keyof AuctionSlotsEventsMap]: (data: AuctionSlotsEventsMap[Event]) => void
}
