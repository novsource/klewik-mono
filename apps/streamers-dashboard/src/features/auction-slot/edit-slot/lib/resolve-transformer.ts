import type { EditSlotFormData } from '../model'

import { deleteAllSpacesFromString } from '~shared/utils/string-format'

import { EditSlotFormSchema } from '../model'

export type TransformedEditSlotFormData = Omit<EditSlotFormData, 'points'> & {
  points: number
}

export const transformEditSlotFormData = () => {
  return EditSlotFormSchema.transform<TransformedEditSlotFormData>((slot) => {
    return {
      title: slot.title,
      points: Number(deleteAllSpacesFromString(slot.points)),
    }
  })
}
