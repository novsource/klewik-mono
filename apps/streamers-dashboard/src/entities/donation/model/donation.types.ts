import { z } from 'zod'

import { DonationSchema, ProcessedDonationSchema } from './donation.contracts'

type Donation = z.infer<typeof DonationSchema>

type ProcessedDonation = z.infer<typeof ProcessedDonationSchema>

type DonationSources = 'donationAlerts' | 'donatePay' | 'twitch' | 'userInput'

type ProcessedDonationStatus =
  | 'added'
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
  Donation,
  TwitchDonation,
  DonationSources,
  ProcessedDonationStatus,
  ProcessedDonationAction,
  DonationMessageType,
  UserCustomDonation,
  DonationAlertsDonation,
  DonatePayDonation,
  ProcessedDonation,
}
