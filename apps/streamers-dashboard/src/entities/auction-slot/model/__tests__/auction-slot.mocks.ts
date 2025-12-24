import { faker } from '@faker-js/faker'

type CreateSingleFakeAuctionSlotsOptions = {
  id?: number
  pointsRange?: {
    min?: number
    max?: number
  }
}

export const createSingleFakeAuctionSlot = (options?: CreateSingleFakeAuctionSlotsOptions) => ({
  id: options?.id ?? 1,
  title: faker.word.words({ count: { min: 3, max: 7 } }),
  auctionSlotOrder: options?.id ?? 1,
  points: faker.number.int({ min: options?.pointsRange?.min ?? 200, max: options?.pointsRange?.max ?? 205000 }),
})

type CreateFakeAuctionSlotsArrayOptions = {
  minLength?: number
  maxLength?: number
}

export const createFakeAuctionSlotsArray = (options?: CreateFakeAuctionSlotsArrayOptions) => {
  return Array
    .from({
      length: faker.number.int({ min: options?.minLength ?? 10, max: options?.maxLength ?? 10 }),
    })
    .fill(null)
    .map((_, index) => createSingleFakeAuctionSlot({ id: index + 1 }))
}
