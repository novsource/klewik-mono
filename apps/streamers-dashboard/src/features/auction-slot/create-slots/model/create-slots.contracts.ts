import { z } from 'zod'

export const createSlotSchema = z.object({
  slots: z
    .object({
      name: z.string().min(3),
      points: z.string().min(3),
    })
    .array()
    .min(1),
})
