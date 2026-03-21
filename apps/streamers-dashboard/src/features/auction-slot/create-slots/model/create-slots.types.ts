import type z from 'zod'

import type { createSlotSchema } from './create-slots.contracts'

import type { AuctionSlotsDTO } from '~shared/api/http/auction-slots'

export type CreateSlotForm = z.infer<typeof createSlotSchema>
export type FormArrayData = Omit<AuctionSlotsDTO, 'id' | 'auctionSlotOrder' | 'isAlived' | 'isDropped'>

export type TransformedCreateSlotsFormData = { slots: Array<FormArrayData> }
