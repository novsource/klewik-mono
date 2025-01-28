import { z } from 'zod'

import { DonationSchema } from './donation.contracts'

type Donation = z.infer<typeof DonationSchema>

type DonationAlertsDonation = Omit<Donation, 'provider'> & {
  provider: 'donation-alerts'
}

type DonatePayDonation = Omit<Donation, 'provider'> & {
  provider: 'donate-pay'
}

export type { Donation, DonationAlertsDonation, DonatePayDonation }
