import { AuctionSlot } from '~entities/auction-slot/model'

import { deleteAllSpacesFromString } from '~shared/utils/string-format'

import { createSlotSchema } from '../model'

type TransformedCreateSlotsFormData = Array<Omit<AuctionSlot, 'id' | 'color'>>

const transformCreateSlotsFormData = () => {
  return createSlotSchema.transform<TransformedCreateSlotsFormData>((val) => {
    return val['slots'].map((slot) => ({
      ...slot,
      points: Number(deleteAllSpacesFromString(slot.points)),
    }))
  })
}

export { transformCreateSlotsFormData }
export type { TransformedCreateSlotsFormData }
