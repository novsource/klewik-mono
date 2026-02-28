import type z from 'zod'

import type { AuthTwitchParamsSchema, DonationAlertsParamsSchema } from './connect-integration.models'

export type DonationAlertsRedirectParams = z.infer<typeof DonationAlertsParamsSchema>
export type AuthTwitchRedirectParams = z.infer<typeof AuthTwitchParamsSchema>
