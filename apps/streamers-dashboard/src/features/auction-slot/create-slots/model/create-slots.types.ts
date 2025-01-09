import { z } from 'zod'

import { AuctionSlot } from '~entities/auction-slot/model/@x/auction-slot'

import { createSlotSchema } from './create-slots.contracts'

export type CreateSlotForm = z.infer<typeof createSlotSchema>
export type FormArrayData = Omit<AuctionSlot, 'id' | 'color'>
