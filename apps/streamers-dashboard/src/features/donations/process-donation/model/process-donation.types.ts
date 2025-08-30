import type { z } from 'zod'

import type { processDonationSchema } from './process-donation.contracts'

export type ProcessDonation = z.infer<typeof processDonationSchema>
