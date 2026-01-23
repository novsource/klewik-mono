import type { z } from 'zod'

import type { AuctionViewParametersFormSchema } from './contracts'

export type SetAuctionViewParametersFormData = z.infer<
  typeof AuctionViewParametersFormSchema
>
