import { z } from 'zod'

import { DonationSchema, ProcessedDonationSchema } from './donation.contracts'

type Donation = z.infer<typeof DonationSchema>

type ProcessedDonation = z.infer<typeof ProcessedDonationSchema>

type DonationAlertsDonation = Omit<ProcessedDonation, 'provider'> & {
  provider: 'donationAlerts'
}

type DonatePayDonation = Omit<ProcessedDonation, 'provider'> & {
  provider: 'donatePay'
}

export type {
  Donation,
  DonationAlertsDonation,
  DonatePayDonation,
  ProcessedDonation,
}
