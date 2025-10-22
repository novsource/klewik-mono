import type { z } from 'zod'

import type { EditSlotFormSchema } from './edit-slot.contracts'

export type EditSlotFormData = z.infer<typeof EditSlotFormSchema>
