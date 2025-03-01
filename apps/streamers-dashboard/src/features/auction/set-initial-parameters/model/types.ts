import { z } from 'zod'

import { AuctionViewParametersFormSchema } from './contracts'

type SetAuctionViewParametersFormData = z.infer<
  typeof AuctionViewParametersFormSchema
>

export type { SetAuctionViewParametersFormData }
