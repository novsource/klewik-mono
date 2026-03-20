import { z } from 'zod'

import { WheelSlotSchema } from './wheel.contracts'

export type WheelMode = 'classic' | 'dropout'

export type WheelSlot = z.infer<typeof WheelSlotSchema>
