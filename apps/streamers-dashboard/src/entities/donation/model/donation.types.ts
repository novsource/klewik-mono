import { z } from 'zod'

import { DonationSchema } from './donation.contracts'

type Donation = z.infer<typeof DonationSchema>

export { type Donation }
