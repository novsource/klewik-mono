import { z } from 'zod'

import { createSlotSchema } from './create-slots.contracts'

export type CreateSlotForm = z.infer<typeof createSlotSchema>
export type FormArrayData = Record<'slots', CreateSlotForm[]>
