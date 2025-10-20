import type { z } from 'zod'

import type { ProcessedDonationDTOSchema } from './donations-api.contracts'

export type ProcessedDonationDTOStatus
  = | 'added'
    | 'checkRequested'
    | 'error'
    | 'empty'
    | 'rejected'
    | 'inProgress'

export type ProcessedDonationDTOAction = 'createSlot' | 'updateSlot' | 'noAction'

export type ProcessedDonationDTO = z.infer<typeof ProcessedDonationDTOSchema>
