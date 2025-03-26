import { z } from 'zod'

import {
  DonationDTOSchema,
  DonationsEventSourceMessageSchema,
} from './channel.contracts'

type DonationDTO = z.infer<typeof DonationDTOSchema>

type DonationsEventSourceMessage = z.infer<
  typeof DonationsEventSourceMessageSchema
>

type DonationsSSEChannelEventsMap = {
  'donations/add': (data: DonationDTO) => void
}

export type {
  DonationDTO,
  DonationsEventSourceMessage,
  DonationsSSEChannelEventsMap as DonationsEventsCallbacks,
}
