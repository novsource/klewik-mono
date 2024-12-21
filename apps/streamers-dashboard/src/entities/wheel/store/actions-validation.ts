import { WheelSlot, WheelSlotContract } from '../model'

export const validateSlotsPayload = (payload: WheelSlot | WheelSlot[]) => {
  try {
    if (Array.isArray(payload)) {
      payload.forEach((slot) => WheelSlotContract.parse(slot))
    } else {
      WheelSlotContract.parse(payload)
    }
    return payload
  } catch (err) {
    throw err
  }
}
