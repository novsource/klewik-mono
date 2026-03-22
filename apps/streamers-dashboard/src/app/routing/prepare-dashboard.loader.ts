import { json } from 'react-router-dom'
import type { NonIndexRouteObject } from 'react-router-dom'

import { isAxiosError } from 'axios'
import z from 'zod'

import { rootStore } from '~app/store/store'

import { splittedAuctionApi } from '~entities/auction/api'
import { auctionActions } from '~entities/auction/store'

import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'

import { splittedDonationApi } from '~entities/donation/api'

import { splittedIntegrationsApi } from '~entities/integrations/api'

import type { AuctionDTO } from '~shared/api/http/auction'

import type { ErrorStatusesWithReason } from '~shared/constants/router'
import { errorStatusReasons } from '~shared/constants/router'

import { isError } from '~shared/utils'
import { isHttpError } from '~shared/utils/validation'
import { isStringEmpty } from '~shared/utils/validation/is-string-empty'

export const prepareDashboardRouteLoader: NonIndexRouteObject['loader'] = async ({ params }) => {
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

  const getAuctionInfoThunkAction = splittedAuctionApi.endpoints.getAuctionInfo.initiate({ auctionUUID })
  const getDonationsStatusesStatsThunkAction = splittedDonationApi.endpoints.getDonationsStats.initiate({ auctionUUID })
  const getConnectedIntegrationsStatsThunkAction = splittedIntegrationsApi.endpoints.getConnectedIntegrations.initiate({ auctionUUID })
  const getAuctionSlotsThunkAction = splittedAuctionSlotsApi.endpoints.getAuctionSlots.initiate({ auctionUUID })

  const thunkActions = [
    getAuctionInfoThunkAction,
    getDonationsStatusesStatsThunkAction,
    getConnectedIntegrationsStatsThunkAction,
    getAuctionSlotsThunkAction,
  ] as const

  const queryActions = thunkActions.map(thunkAction => thunkAction(dispatch, rootStore.getState, null).unwrap())

  try {
    const responses = await Promise.all(queryActions)

    responses.forEach((response) => {
      if (isAxiosError(response)) {
        throw response
      }
    })

    const auctionInfo = responses[0] as AuctionDTO

    if (!auctionInfo || Object.keys(auctionInfo).length === 0) {
      throw json({
        reason: 'Аукцион не найден',
      }, { status: 404 })
    }

    dispatch(auctionActions.setAuction(auctionInfo))

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

    if (isHttpError(error)) {
      const hint = error.hint ?? 'Если есть возможность напишите об этом в issues на Github проекта'
      const reason = isStringEmpty(error.reason ?? '')
        ? errorStatusReasons[error.status?.toString() as unknown as ErrorStatusesWithReason]
        : 'Неизвестная причина'

      throw json({
        reason,
        hint,
      }, {
        status: error.status,
      })
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

    const reason = typeof error === 'object' && error !== null
      ? 'message' in error
        ? error.message
        : 'Неизвестная ошибка. Если есть возможность напишите об этом в issues на Github проекта'
      : 'Неизвестная ошибка. Если есть возможность напишите об этом в issues на Github проекта'

    throw json({
      reason,
    }, {
      status: 400,
    })
  }
}
