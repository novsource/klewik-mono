import { WheelSlot, WheelSlotSchema } from '../../model'

export const validateSlotsPayload = (payload: WheelSlot | WheelSlot[]) => {
  try {
    if (Array.isArray(payload)) {
      payload.forEach((slot) => WheelSlotSchema.parse(slot))
    } else {
      WheelSlotSchema.parse(payload)
    }
    return payload
  } catch (err) {
    throw err
  }
}
