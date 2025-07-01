import type { z } from 'zod'

import type { DonationSchema, ProcessedDonationSchema } from './donation.contracts'

type Donation = z.infer<typeof DonationSchema>

type ProcessedDonation = z.infer<typeof ProcessedDonationSchema>

type DonationSources = 'donationAlerts' | 'donatePay' | 'twitch' | 'userInput'

type ProcessedDonationStatus
  = | 'added'
    | 'checkRequested'
    | 'error'
    | 'empty'
    | 'rejected'
    | 'inProgress'

type ProcessedDonationAction = 'createSlot' | 'updateSlot' | 'noAction'

type DonationMessageType = 'text' | 'audio' | 'empty'

type DonationAlertsDonation = Omit<ProcessedDonation, 'source'> & {
  source: 'donationAlerts'
}

type DonatePayDonation = Omit<ProcessedDonation, 'source'> & {
  source: 'donatePay'
}

type TwitchDonation = Omit<ProcessedDonation, 'source'> & {
  source: 'twitch'
}

type UserCustomDonation = Omit<ProcessedDonation, 'source'> & {
  source: 'userInput'
}

export type {
  DonatePayDonation,
  Donation,
  DonationAlertsDonation,
  DonationMessageType,
  DonationSources,
  ProcessedDonation,
  ProcessedDonationAction,
  ProcessedDonationStatus,
  TwitchDonation,
  UserCustomDonation,
}
