import type { z } from 'zod'

import type { DonationCodeSchema, DonationSchema, ProcessedDonationSchema } from './donation.contracts'

export type Donation = z.infer<typeof DonationSchema>

export type ProcessedDonation = z.infer<typeof ProcessedDonationSchema>

export type DonationCode = z.infer<typeof DonationCodeSchema>

export type DonationSources = 'donationAlerts' | 'donatePay' | 'twitch' | 'userInput'

export type ProcessedDonationStatus
  = | 'added'
    | 'checkRequested'
    | 'error'
    | 'empty'
    | 'rejected'
    | 'inProgress'

export type ProcessedDonationAction = 'createSlot' | 'updateSlot' | 'noAction'

export type DonationMessageType = 'text' | 'audio' | 'empty'

export type DonationAlertsDonation = Omit<ProcessedDonation, 'source'> & {
  source: 'donationAlerts'
}

export type DonatePayDonation = Omit<ProcessedDonation, 'source'> & {
  source: 'donatePay'
}

export type TwitchDonation = Omit<ProcessedDonation, 'source'> & {
  source: 'twitch'
}

export type UserCustomDonation = Omit<ProcessedDonation, 'source'> & {
  source: 'userInput'
}
