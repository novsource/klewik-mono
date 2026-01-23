import type { AuctionSlot } from '~entities/auction-slot/model'

import { deleteAllSpacesFromString } from '~shared/utils/string-format'

import { createSlotSchema } from '../model'

type TransformedCreateSlotsFormData = { slots: Array<Omit<AuctionSlot, 'id' | 'color' | 'auctionSlotOrder'>> }

const transformCreateSlotsFormData = () => {
  return createSlotSchema.transform<TransformedCreateSlotsFormData>((value) => {
    const transformedSlots = value.slots.map(slot => ({
      ...slot,
      points: typeof slot.points === 'number' ? slot.points : Number(deleteAllSpacesFromString(slot.points)),
    }))

    return { slots: transformedSlots }
  })
}

export { transformCreateSlotsFormData }
export type { TransformedCreateSlotsFormData }
