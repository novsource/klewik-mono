import { z } from 'zod'

import { EditSlotFormSchema } from './edit-slot.contracts'

type EditSlotFormData = z.infer<typeof EditSlotFormSchema>

export type { EditSlotFormData }
