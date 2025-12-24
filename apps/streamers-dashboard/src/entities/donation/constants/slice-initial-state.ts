import type { DonationsSliceState } from '../store/donations.slice'

// const createFakeDonations = (count: number) => {
//   let idCount = 0

//   const getFromFakerArray = <T>(...elements: T[]) => {
//     return faker.helpers.arrayElement<T>(elements)
//   }

//   return Array.from({ length: count }).map<DonationAlertsDonation>(_ => ({
//     id: ++idCount,
//     auctionId: 2,
//     amount: faker.number.int({ min: 200, max: 50000 }),
//     currency: faker.finance.currency().code,
//     message: faker.word.words({ count: { min: 5, max: 20 } }),
//     messageType: getFromFakerArray<DonationAlertsDonation['messageType']>('audio', 'empty', 'text'),
//     source: 'donationAlerts',
//     username: faker.internet.username(),
//     createdAt: faker.date.recent().toUTCString(),
//     updatedAt: faker.date.recent().toUTCString(),
//     sourceDonationId: 12,
//     processData: {
//       action: getFromFakerArray<DonationAlertsDonation['processData']['action']>('createSlot', 'noAction', 'updateSlot'),
//       slotsIds: [faker.number.int(), faker.number.int()],
//       status: getFromFakerArray<DonationAlertsDonation['processData']['status']>('added', 'checkRequested', 'empty', 'error', 'inProgress', 'rejected'),
//     },
//   }))
// }

export const DONATIONS_SLICE_INITIAL_STATE: DonationsSliceState = {
  donations: {
    all: [],
    donatePay: [],
    donationAlerts: [],
    twitch: [],
    userInput: [],
  },
  donationsStatusesCounts: {
    added: 0,
    checkRequested: 0,
    empty: 0,
    error: 0,
    inProgress: 0,
    rejected: 0,
  },
}
