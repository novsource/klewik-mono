import { deleteAllSpacesFromString } from '~shared/utils/string-format'

import { EditSlotFormData, EditSlotFormSchema } from '../model'

type TransformedEditSlotFormData = Omit<EditSlotFormData, 'points'> & {
  points: number
}

const transformEditSlotFormData = () => {
  return EditSlotFormSchema.transform<TransformedEditSlotFormData>((slot) => {
    return { ...slot, points: Number(deleteAllSpacesFromString(slot.points)) }
  })
}

export { transformEditSlotFormData }
export type { TransformedEditSlotFormData }
