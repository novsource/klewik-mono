import type { z } from 'zod'

import type {
  DonationsEventSourceMessageSchema,
  ProcessedDonationDTOSchema,
} from './channel.contracts'

export type ProcessedDonationDTOStatus
  = | 'added'
    | 'checkRequested'
    | 'error'
    | 'empty'
    | 'rejected'
    | 'inProgress'

export type ProcessedDonationDTOAction = 'createSlot' | 'updateSlot' | 'noAction'

export type DonationsEventSourceMessage = z.infer<
  typeof DonationsEventSourceMessageSchema
>

export type ProcessedDonationDTO = z.infer<typeof ProcessedDonationDTOSchema>

export type DonationsSSEEventsMap = {
  'donations/add': ProcessedDonationDTO
}

export type DonationsSSEChannelEventsMap = {
  'donations/add': (data: ProcessedDonationDTO) => void
}
