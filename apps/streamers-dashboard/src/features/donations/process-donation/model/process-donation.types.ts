import type { z } from 'zod'

import type { ProcessDonationFormSchema } from './process-donation.contracts'

export type ProcessDonationForm = z.infer<typeof ProcessDonationFormSchema>
