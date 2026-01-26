import { z } from 'zod'

import { integrationsPlatforms } from '~shared/constants/integrations'

export const IntegrationsPlatformsDTOSchema = z.enum(integrationsPlatforms).array()
