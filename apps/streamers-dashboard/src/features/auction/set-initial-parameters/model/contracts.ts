import { ZodOptional, ZodString, z } from 'zod'

const streamingPlatformsLinks = ['twitch', 'youtube'] as const

const donatePlatformsLinks = ['donationAlerts'] as const

const auctionLinks = [
  ...streamingPlatformsLinks,
  ...donatePlatformsLinks,
] as const

const LinksSchemas = {
  youtube: z.string().url().optional(),
  donationAlerts: z.string().url().optional(),
  twitch: z.string().url().optional(),
} satisfies { [T in (typeof auctionLinks)[number]]: ZodOptional<ZodString> }

const AuctionViewParametersFormSchema = z.object({
  title: z.string().min(6).max(40),
  links: z.object(LinksSchemas),
})

export { AuctionViewParametersFormSchema, auctionLinks }
