import type {
  RouteObject,
} from 'react-router-dom'
import {
  json,
  Outlet,
} from 'react-router-dom'

import { AxiosError } from 'axios'
import { z } from 'zod'

import { store } from '~app/store'

import { ErrorPage } from '~pages/error/ui/error-page.ui'

import type { Auction } from '~entities/auction/model'
import { auctionActions } from '~entities/auction/store'

import { getAuctionInfo } from '~shared/api/http/auction/auction.api'

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

        const response = await getAuctionInfo<Auction>(
          validatedParams.data.auctionId,
        )

        dispatch(auctionActions.setAuction(response.data))

        return response.data
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
      }
    },
    errorElement: <ErrorPage />,
    children: childrens,
  }
}
