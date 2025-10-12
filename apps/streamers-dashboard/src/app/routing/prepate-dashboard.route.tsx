import type {
  RouteObject,
} from 'react-router-dom'
import { json, Outlet } from 'react-router-dom'

import { AxiosError, isAxiosError } from 'axios'
import { z } from 'zod'

import { store } from '~app/store'

import { ErrorPage } from '~pages/error/ui/error-page.ui'

import { getAuctionInfoThunk } from '~entities/auction/api'

import { getAuctionSlotsThunk } from '~entities/auction-slot/api'

import type { ErrorStatusesWithReason } from '~shared/constants/router'
import { errorStatusReasons } from '~shared/constants/router'

export const prepareDashboardRoute = (childrens: RouteObject[]): RouteObject => {
  return {
    element: <Outlet />,
    loader: async ({ params }) => {
      const isAlreadyLoaded = !!store.getState().auction.auctionInfo.id

      if (isAlreadyLoaded)
        return store.getState().auction.auctionInfo

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
        const dispatch = store.dispatch
        const auctionUUID = validatedParams.data.auctionId

        const thunksArr = [
          dispatch<any>(getAuctionInfoThunk(auctionUUID)),
          dispatch<any>(getAuctionSlotsThunk(auctionUUID)),
        ]

        const [auctionInfoResponse, slotsResponse] = await Promise.all(thunksArr)

        const isAuctionInfoResponseError = isAxiosError(auctionInfoResponse.payload)
        const isAuctionSlotsResponseError = isAxiosError(slotsResponse.payload)

        if (isAuctionInfoResponseError) {
          throw auctionInfoResponse.payload
        }

        if (isAuctionSlotsResponseError) {
          throw slotsResponse.payload
        }

        return json(auctionInfoResponse, { status: 200 })
      }
      catch (error) {
        if (error instanceof AxiosError) {
          const isStatusHaveReason = error.status !== undefined && Reflect.has(errorStatusReasons, error.status.toString())
          const reason = isStatusHaveReason ? errorStatusReasons[error.status?.toString() as unknown as ErrorStatusesWithReason] : 'Неизвестная причина'

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
        if (error instanceof Error) {
          const isAuctionNotFound = error.message.includes('404')

          if (isAuctionNotFound) {
            throw json({
              reason,
              hint: 'Не удалось найти аукцион. Попробуйте войти через главную страницу',
            }, {
              status: 404,
            })
          }
        }

        if ('message' in error) {
          const isAuctionNotFound = error.message.includes('404')

          if (isAuctionNotFound) {
            throw json({
              reason,
              hint: 'Не удалось найти аукцион. Попробуйте войти через главную страницу',
            }, {
              status: 404,
            })
          }
        }
      }
    },
    errorElement: <ErrorPage />,
    children: childrens,
  }
}
