import type { AuctionSlot } from '~entities/auction-slot/model'

export const klewikLocalExportSerializer = (slots: AuctionSlot[]): string | undefined => {
  try {
    const serializedData = JSON.stringify(slots)

    return serializedData
  }
  catch {
    return undefined
  }
}
