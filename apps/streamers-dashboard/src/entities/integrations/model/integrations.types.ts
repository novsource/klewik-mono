import type { integrationsPlatforms } from '~shared/constants/integrations'

type IntegrationsPlatforms = (typeof integrationsPlatforms)[number]

export type { IntegrationsPlatforms }
