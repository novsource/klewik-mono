import { z } from 'zod'

const streamingPlatformsLinks = ['twitch', 'youtube'] as const
const donatePlatformsLinks = ['donationAlerts'] as const

export const auctionInitialDetailsFormLinks = [
  ...streamingPlatformsLinks,
  ...donatePlatformsLinks,
] as const

// export const AuctionViewParametersFormSchema = z.object({
//   title: z.string().min(6).max(40),
//   links: z.object({
//     youtube: YoutubeURLSchema.or(z.string().max(0)),
//     donationAlerts: DonationAlertsURLSchema.or(z.string().max(0)),
//     twitch: TwitchURLSchema.or(z.string().max(0)),
//   }),
// })

export const AuctionViewParametersFormSchema = z.object({
  title: z.string().min(6).max(40),
})
