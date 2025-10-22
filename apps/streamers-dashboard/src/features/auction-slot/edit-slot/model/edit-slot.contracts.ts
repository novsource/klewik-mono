import { z } from 'zod'

import { AuctionSlotSchema } from '~entities/auction-slot/model'

export const EditSlotFormSchema = AuctionSlotSchema.omit({
  id: true,
  auctionSlotOrder: true,
  color: true,
}).merge(
  z.object({
    points: z
      .string()
      .min(1, 'Поле не может быть пустым')
      .max(20, 'Слишком большое количество очков'),
  }),
)
