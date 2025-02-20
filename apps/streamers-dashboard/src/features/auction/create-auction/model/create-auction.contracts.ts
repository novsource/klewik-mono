import { z } from 'zod'

const CreateAuctionSchema = z.object({
  key: z.string().refine((check) => check.length >= 1, {
    message: 'Поле не может быть пустым',
  }),
})

export { CreateAuctionSchema }
