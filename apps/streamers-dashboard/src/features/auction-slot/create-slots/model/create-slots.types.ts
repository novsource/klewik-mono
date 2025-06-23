import type z from 'zod'

import type { createSlotSchema } from './create-slots.contracts'

import type { AuctionSlot } from '~entities/auction-slot/model/@x/auction-slot'

export type CreateSlotForm = z.infer<typeof createSlotSchema>
export type FormArrayData = Omit<AuctionSlot, 'id' | 'color'>
