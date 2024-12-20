import { z } from 'zod'

import { WheelSlotContract } from './wheel.contracts'

export type WheelMode = 'classic' | 'dropout'

export type WheelSlot = z.infer<typeof WheelSlotContract>
