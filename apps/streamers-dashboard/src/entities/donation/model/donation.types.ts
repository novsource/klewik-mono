import { z } from 'zod'

import { DonationSchema, ProcessedDonationSchema } from './donation.contracts'

type Donation = z.infer<typeof DonationSchema>

type ProcessedDonation = z.infer<typeof ProcessedDonationSchema>

type DonationAlertsDonation = Omit<Donation, 'provider'> & {
  provider: 'donation-alerts'
}

type DonatePayDonation = Omit<Donation, 'provider'> & {
  provider: 'donate-pay'
}

export type {
  Donation,
  DonationAlertsDonation,
  DonatePayDonation,
  ProcessedDonation,
}
