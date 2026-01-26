import type { DonationAlertsDonation, ProcessedDonation } from '..'

import { faker } from '@faker-js/faker'

type CreateSingleFakeDonationOptions = {
  id?: number
}

const getFromFakerArray = <T>(...elements: T[]) => {
  return faker.helpers.arrayElement<T>(elements)
}

export const createSingleFakeDonation = (options?: CreateSingleFakeDonationOptions): ProcessedDonation => ({
  id: options?.id ?? 1,
  auctionId: 2,
  amount: faker.number.int({ min: 200, max: 50000 }),
  currency: faker.finance.currency().code,
  message: faker.word.words({ count: { min: 5, max: 20 } }),
  messageType: getFromFakerArray<DonationAlertsDonation['messageType']>('audio', 'empty', 'text'),
  source: 'donationAlerts',
  username: faker.internet.username(),
  createdAt: faker.date.recent().toUTCString(),
  updatedAt: faker.date.recent().toUTCString(),
  sourceDonationId: 12,
  processData: {
    action: getFromFakerArray<DonationAlertsDonation['processData']['action']>('createSlot', 'noAction', 'updateSlot'),
    slotsIds: [faker.number.int(), faker.number.int()],
    status: getFromFakerArray<DonationAlertsDonation['processData']['status']>('added', 'checkRequested', 'empty', 'error', 'inProgress', 'rejected'),
    addedPoints: faker.number.int(),
    title: faker.word.words({ count: { min: 2, max: 6 } }),
    donationCode: getFromFakerArray(faker.string.fromCharacters(['a', 'b', 'c'], { min: 8, max: 8 }), null),
  },
})

type CreateFakeDonationsArrayOptions = {
  minLength?: number
  maxLength?: number
}

export const createFakeDonationsArray = (options?: CreateFakeDonationsArrayOptions) => {
  return Array
    .from({
      length: faker.number.int({ min: options?.minLength ?? 10, max: options?.maxLength ?? 10 }),
    })
    .fill(null)
    .map((_, index) => createSingleFakeDonation({ id: index + 1 }))
}
