import type { z } from 'zod'

import type { IntegrationsPlatformsDTOSchema } from './integrations-api.contracts'

export type IntegrationsPlatformsDTO = z.infer<typeof IntegrationsPlatformsDTOSchema>[number]
