import { z } from 'zod'

import { deleteAllSpacesFromString } from '~shared/utils/formatting'

export const createSlotSchema = z.object({
  slots: z
    .object({
      title: z
        .string()
        .refine((check) => {
          const strWithoutSpaces = deleteAllSpacesFromString(check)

          if (strWithoutSpaces.length < 3)
            return false

          return true
        }, 'Слишком короткое название слота. Минимальный размер - 3 символа')
        .refine((check) => {
          const strWithoutSpaces = deleteAllSpacesFromString(check)

          if (strWithoutSpaces.length >= 120)
            return false

          return true
        }, 'Количество символов в названии слота не может быть больше 120-ти символов'),
      points: z.union([
        z
          .string()
          .min(1, 'Поле не может быть пустым')
          .max(20, 'Слишком большое количество очков'),
        z.number().positive().min(10),
      ]),
    })
    .array()
    .min(1),
})
