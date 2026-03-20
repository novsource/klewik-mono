import z from 'zod'

export const DonationAlertsParamsSchema = z.object({
  auction: z.uuid(),
  error: z.boolean(),
  errorReason: z.string(),
  auth: z.boolean(),
  provider: z.literal('donationAlerts'),
})

export const AuthTwitchParamsSchema = z.object({
  provider: z.literal('twitch'),
  auth: z.boolean(),
  state: z.string(),
  error: z.boolean().optional(),
  errorReason: z.string().optional(),
})
