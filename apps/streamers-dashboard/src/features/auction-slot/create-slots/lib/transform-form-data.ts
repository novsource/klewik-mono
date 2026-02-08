import type { TransformedCreateSlotsFormData } from '../model'

import { deleteAllSpacesFromString } from '~shared/utils/string-format'

import { createSlotSchema } from '../model'

export const transformCreateSlotsFormData = () => {
  return createSlotSchema.transform<TransformedCreateSlotsFormData>((value) => {
    const transformedSlots = value.slots.map(slot => ({
      ...slot,
      points: typeof slot.points === 'number' ? slot.points : Number(deleteAllSpacesFromString(slot.points)),
    }))

    return { slots: transformedSlots }
  })
}
