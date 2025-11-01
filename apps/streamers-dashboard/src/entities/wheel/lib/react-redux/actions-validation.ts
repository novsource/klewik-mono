import type { WheelSlot } from '../../model'

import { WheelSlotSchema } from '../../model'

export const validateWheelSlotsPayload = (payload: WheelSlot | WheelSlot[]) => {
  try {
    if (Array.isArray(payload)) {
      const validatedData = payload.map(slot => WheelSlotSchema.parse(slot))

      return validatedData
    }
    else {
      const validatedSlot = WheelSlotSchema.parse(payload)

      return validatedSlot
    }
  }
  catch (err) {
    console.log('error:', err)
    throw err
  }
}
