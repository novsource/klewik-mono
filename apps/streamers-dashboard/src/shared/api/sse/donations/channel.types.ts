import { z } from 'zod'

import {
  DonationSchema,
  DonationsEventSourceMessageSchema,
} from './channel.contracts'

type DonationDTO = z.infer<typeof DonationSchema>

type DonationsEventSourceMessage = z.infer<
  typeof DonationsEventSourceMessageSchema
>

type DonationsEventsMap = {
  'donations/add': DonationDTO
}

type DonationsEventsCallbacks = {
  'donations/add': (data: DonationDTO) => void
}

export type {
  DonationDTO,
  DonationsEventSourceMessage,
  DonationsEventsMap,
  DonationsEventsCallbacks,
}
