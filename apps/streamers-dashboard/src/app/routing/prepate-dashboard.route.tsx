import type {
  RouteObject,
} from 'react-router-dom'
import { json } from 'react-router-dom'

import { isAxiosError } from 'axios'
import { z } from 'zod'

import { GlobalDialogs } from '~app/components/global-dialogs/ui/global-dialogs.ui'
import { rootStore } from '~app/store/store'

import { DashboardLayout } from '~pages/dashboard/_layout'
import { ErrorPage } from '~pages/error/ui'

import { splittedAuctionApi } from '~entities/auction/api'
import { auctionActions } from '~entities/auction/store'

import { getAuctionSlotsThunk } from '~entities/auction-slot/api'

import { splittedDonationApi } from '~entities/donation/api'

import { splittedIntegrationsApi } from '~entities/integrations/api/integrations.api'

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
      const validatedParams = z
        .object({ auctionUUID: z.string().uuid() })
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

      const dispatch = rootStore.dispatch

      const auctionUUID = validatedParams.data.auctionUUID

      const getAuctionInfoPromise = splittedAuctionApi.endpoints.getAuctionInfo.initiate({ auctionUUID })
      const getDonationsStatusesStatsPromise = splittedDonationApi.endpoints.getDonationsStats.initiate({ auctionUUID })
      const getConnectedIntegrationsStatsPromise = splittedIntegrationsApi.endpoints.getConnectedIntegrations.initiate({ auctionUUID })
      const getAuctionSlotsPromise = getAuctionSlotsThunk(auctionUUID)

      const requestsArr = [
        getAuctionInfoPromise,
        getDonationsStatusesStatsPromise,
        getConnectedIntegrationsStatsPromise,
        getAuctionSlotsPromise,
        // @ts-expect-error unknown action
      ].map(thunkAction => dispatch(thunkAction))

      try {
        const responses = await Promise.all(requestsArr)

        responses.forEach((response) => {
          if (isAxiosError(response)) {
            throw response
          }
        })

        const auctionInfo = responses[0].data

        if (!auctionInfo || Object.keys(auctionInfo).length === 0) {
          throw json({
            reason: 'Аукцион не найден',
          }, { status: 404 })
        }

        rootStore.dispatch(auctionActions.setAuction(auctionInfo))

        return null
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
