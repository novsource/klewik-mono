import { z } from 'zod'

const CreateAuctionSchema = z.object({
  password: z.string().refine((check) => check.length >= 1, {
    message: 'Поле не может быть пустым',
  }),
})

export { CreateAuctionSchema }
