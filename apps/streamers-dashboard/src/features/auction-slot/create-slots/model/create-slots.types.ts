import type z from 'zod'

import type { createSlotSchema } from './create-slots.contracts'

import type { AuctionSlotDTO } from '~shared/api/sse/clients/auction-slots'

export type CreateSlotForm = z.infer<typeof createSlotSchema>
export type FormArrayData = Omit<AuctionSlotDTO, 'id' | 'auctionSlotOrder'>

export type TransformedCreateSlotsFormData = { slots: Array<FormArrayData> }
