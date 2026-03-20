import { z } from 'zod'

export const integrationsPlatforms = [
  'donationAlerts',
  'donatePay',
  'twitch',
  'userInput',
] as const

export const DonationAlertsURLSchema = z.string().regex(/^>?(https?:\/\/)?(?:www\.)?donationalerts\.com\/r\/([\w-]+)$/i)
export const DonatePayURLSchema = z.string().regex(/^>?(https?:\/\/)?(?:www\.)?new\.donatepay\.ru\/([\w-]+)$/i)
export const TwitchURLSchema = z.string().regex(/^>?(https?:\/\/)?(?:www\.)?twitch\.tv\/([\w-]+)$/i)
export const YoutubeURLSchema = z.string().regex(/^>?(https?:\/\/)?(?:www\.)?youtube\.com\/@([\w-]+)$/i)
