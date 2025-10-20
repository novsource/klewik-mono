import type { z } from 'zod'

import type { processDonationFormSchema } from './process-donation.contracts'

export type ProcessDonationForm = z.infer<typeof processDonationFormSchema>
