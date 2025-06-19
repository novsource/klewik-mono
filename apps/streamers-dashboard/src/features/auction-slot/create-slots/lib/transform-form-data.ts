import { AuctionSlot } from '~entities/auction-slot/model'

import { deleteAllSpacesFromString } from '~shared/utils/string-format'

import { createSlotSchema } from '../model'

type TransformedCreateSlotsFormData = {
  slots: Array<Omit<AuctionSlot, 'id' | 'color'>>
}

const transformCreateSlotsFormData = () => {
  return createSlotSchema.transform<TransformedCreateSlotsFormData>((val) => {
    const transformedSlots = val['slots'].map((slot) => ({
      ...slot,
      points: Number(deleteAllSpacesFromString(slot.points)),
    }))

    return { slots: transformedSlots }
  })
}

export { transformCreateSlotsFormData }
export type { TransformedCreateSlotsFormData }
