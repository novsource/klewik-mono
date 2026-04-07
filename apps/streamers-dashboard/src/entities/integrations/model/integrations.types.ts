import type { integrationsPlatforms } from '~shared/constants/integrations'

export type IntegrationsPlatforms = (typeof integrationsPlatforms)[number]

export type AuctionPlatform = 'pointauc' | 'klewikLocal'
