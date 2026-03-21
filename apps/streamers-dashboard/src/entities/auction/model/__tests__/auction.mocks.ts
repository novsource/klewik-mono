import type { Auction } from '../auction.types'

import { faker } from '@faker-js/faker'

export const createFakeAuction = (): Auction => ({
  id: faker.number.int({ min: 1 }),
  uuid: faker.string.uuid(),
  ownerId: faker.string.uuid(),
  winnerSlotId: null,
  isBetsClosed: faker.datatype.boolean(),
  isEnded: faker.datatype.boolean(),
  createdAt: faker.date.recent({ days: 1 }).toISOString(),
  endedAt: faker.date.soon({ days: 1 }).toISOString(),
})
