import type { z } from 'zod'

import type {
  AuctionSlotDTOSchema,
  AuctionSlotsEventsMessageSchema,
} from './channel.contracts'

type AuctionSlotDTO = z.infer<typeof AuctionSlotDTOSchema>

type AuctionEventSourceMessage = z.infer<typeof AuctionSlotsEventsMessageSchema>

type AuctionSlotsEventsMap = {
  'auction-slots/add': AuctionSlotDTO[]
  'auction-slots/update': AuctionSlotDTO
}

type AuctionSlotsEventsCallbacks = {
  'auction-slots/add': (data: AuctionSlotDTO[]) => void
  'auction-slots/update': (data: AuctionSlotDTO) => void
}

export type {
  AuctionEventSourceMessage,
  AuctionSlotDTO,
  AuctionSlotsEventsCallbacks,
  AuctionSlotsEventsMap,
}
