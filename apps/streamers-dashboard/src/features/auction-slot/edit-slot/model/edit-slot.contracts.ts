import { z } from 'zod'

export const EditSlotFormSchema = z.object({
  title: z.string(),
  points: z.string(),
})

export const TransformedEditSlotFormSchema = z.object({
  title: z.string().min(3, { error: 'Минимальный размер названия слота - 3 символа' }).max(35, { error: 'Слишком длинное название слота' }),
  points: z.coerce.number().min(10, { error: 'Количество очков не может быть меньше 10' }).max(1_000_000, { error: 'Слишком большое количество очков' }),
})
