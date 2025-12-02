import type { AuctionDTO } from '../http/auction'
import type { CreateAuctionResponse } from '../http/auction/auction.api'

import { faker } from '@faker-js/faker'
import { checkPostFormRequestHeaders } from '~root/tests/utils/mock-server/helpers'
import { http, HttpResponse } from 'msw'
import { z } from 'zod'

import { AUCTION_ENDPOINTS, AUTH_ENDPOINTS } from '~shared/constants/api/http'

type GetAuctionInfoPathIds = {
  auctionUUID: string
}

export const auctionApiMocksHandlers = [
  http.post(AUCTION_ENDPOINTS.CREATE, ({ request }) => {
    const requestHeadersResponse = checkPostFormRequestHeaders(request.headers)
    if (requestHeadersResponse)
      return requestHeadersResponse

    return HttpResponse.json<CreateAuctionResponse>(
      { auctionId: faker.string.uuid(), auctionOwnerId: faker.string.uuid(), url: faker.internet.url() },
    )
  }),
  http.get<GetAuctionInfoPathIds>(`/api/v1/auctions/:auctionUUID`, () => {
    return HttpResponse.json<AuctionDTO>(
      {
        id: faker.number.int(),
        auctionUUID: faker.string.uuid(),
        ownerId: faker.string.uuid(),
        createAt: faker.date.future(),
        endedAt: faker.date.future(),
        dropoutSlotsIds: [],
        processedDonationsIds: [],
        isBetsClosed: false,
        isEnded: false,
        slotsIds: [],
        url: faker.internet.url(),
        wheelMode: 'classic',
        winnerSlotId: null,
      },
    )
  }),
] as const

export const authApiMocksHandlers = [
  http.post(AUTH_ENDPOINTS.LOGIN, () => {

  }),
  http.post(AUTH_ENDPOINTS.REFRESH, ({ cookies }) => {
    const validatedRefreshTokenResult = z.string().uuid().safeParse(cookies?.refreshToken ?? '')

    if (!validatedRefreshTokenResult.success)
      return new HttpResponse(null, { status: 400 })

    return new HttpResponse(null, { headers: {
      'set-cookie': `refreshToken=${faker.string.uuid()}; accessToken=${faker.string.uuid()}; deviceId=${faker.string.uuid()}`,
    }, status: 200 })
  }),
]

// const slotsSSEMessageId = 1
// const donationsSSEMessageId = 1

// export const sseApiMocksHandlers = [
//   sse<AuctionSlotsEventsMap>('/api/v1/auctions/:uuid/sse/slots-events', ({ client }) => {
//     const message = {
//       id: slotsSSEMessageId.toString(),
//       data: JSON.stringify(createFakeAuctionSlotsArray({ minLength: 5, maxLength: 10 })),
//       event: 'auction-slots/add',
//     } as const

//     client.send(message)

//     queueMicrotask(() => {
//       client.close()
//     })
//   }),

//   sse('/api/v1/auctions/:uuid/sse/donations-events', ({ client }) => {
//     client.send({ id: donationsSSEMessageId.toString(), data: 'success', event: 'connect' })

//     queueMicrotask(() => {
//       client.close()
//     })
//   }),
// ]
