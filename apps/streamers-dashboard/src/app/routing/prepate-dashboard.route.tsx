import type {
  RouteObject,
} from 'react-router-dom'
import { json } from 'react-router-dom'

import { GlobalDialogs } from '~features/_common/display-dialogs'
import { isAxiosError } from 'axios'
import { z } from 'zod'

import { DashboardLayout } from '~app/layouts'
import { store } from '~app/store'

import { ErrorPage } from '~pages/error/ui/error-page.ui'

import type { Auction } from '~entities/auction/model'
import { auctionActions } from '~entities/auction/store'

import { getAuctionInfo } from '~shared/api/http/auction/auction.api'
import { getDonationsStats } from '~shared/api/http/donations'

import type { ErrorStatusesWithReason } from '~shared/constants/router'
import { errorStatusReasons } from '~shared/constants/router'

import { isError } from '~shared/utils'

export const prepareDashboardRoute = (childrens: RouteObject[]): RouteObject => {
  return {
    element: (
      <>
        <DashboardLayout />
        <GlobalDialogs />
      </>
    ),
    loader: async ({ params }) => {
      const storeState = store.getState()
      const storedAuctionInfo = storeState.auction.auctionInfo

      const isAlreadyLoaded = !!storedAuctionInfo.id

      if (isAlreadyLoaded)
        return storedAuctionInfo

      const validatedParams = z
        .object({ auctionId: z.string().uuid() })
        .safeParse(params)

      if (!validatedParams.success) {
        throw json(
          {
            reason: 'Некорректный номер аукциона',
            hint: 'Попробуйте войти в аукцион через главную страницу',
          },
          { status: 400 },
        )
      }

      try {
        const auctionUUID = validatedParams.data.auctionId

        const requestsArr = [getAuctionInfo<Auction>(auctionUUID), getDonationsStats(auctionUUID)]
        const responses = await Promise.all(requestsArr)

        responses.forEach((response) => {
          if (isAxiosError(response)) {
            throw response
          }
        })

        const auctionInfoResponse = responses[0]

        const auctionInfo = auctionInfoResponse.data as Auction
        store.dispatch(auctionActions.setAuction(auctionInfo))

        return auctionInfo
      }
      catch (error) {
        if (isAxiosError(error)) {
          const isRejectHaveReason = error.status !== undefined && Reflect.has(errorStatusReasons, error.status.toString())
          const reason = isRejectHaveReason
            ? errorStatusReasons[error.status?.toString() as unknown as ErrorStatusesWithReason]
            : 'Неизвестная причина'

          throw json(
            {
              reason,
              hint: 'Попробуйте перезайти в аукцион через главную страницу',
            },
            {
              status: error.status,
            },
          )
        }

        if (isError(error)) {
          const isAuctionNotFound = error.message.includes('404')

          const reason = isAuctionNotFound
            ? errorStatusReasons['404']
            : 'Неизвестная причина'

          if (isAuctionNotFound) {
            throw json({
              reason,
              hint: 'Попробуйте перезайти в аукцион через главную страницу',
            }, {
              status: isAuctionNotFound ? 404 : 500,
            })
          }
        }
      }
    },
    errorElement: <ErrorPage />,
    children: childrens,
  }
}
