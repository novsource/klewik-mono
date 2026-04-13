import type { z } from 'zod'

import type { WheelSlotSchema } from './wheel.contracts'

export type WheelMode = 'classic' | 'dropout'

export type WheelSlot = z.infer<typeof WheelSlotSchema>
