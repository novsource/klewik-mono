import type { AuctionSlot } from '~entities/auction-slot/model'

type PointaucSlot = {
  name: string
  amount: number | null
  investors: string[]
  isFavorite?: boolean
}

export const pointaucSlotsExportSerializer = (slots: AuctionSlot[]): string | undefined => {
  const transformedSlotsToPointaucSlots = slots.map<PointaucSlot>((slot) => {
    return {
      name: slot.title,
      amount: slot.points,
      investors: [],
    }
  })

  try {
    const serializedData = JSON.stringify({ lots: transformedSlotsToPointaucSlots })

    return serializedData
  }
  catch {
    return undefined
  }
}
