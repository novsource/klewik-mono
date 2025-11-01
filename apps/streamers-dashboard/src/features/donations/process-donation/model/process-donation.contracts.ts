import { z } from 'zod'

import { AuctionSlotSchema } from '~entities/auction-slot/model'

export const ProcessDonationFormSchema = z.object({
  donationId: z.number().nonnegative(),
  title: AuctionSlotSchema.pick({ title: true }).shape.title,
  points: z.string(),
})
