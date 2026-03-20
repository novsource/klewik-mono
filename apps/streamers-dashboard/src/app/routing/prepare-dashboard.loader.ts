import { json } from 'react-router-dom'
import type { NonIndexRouteObject } from 'react-router-dom'

import { isAxiosError } from 'axios'
import z from 'zod'

import { rootStore } from '~app/store/store'

import { splittedAuctionApi } from '~entities/auction/api'
import { auctionActions } from '~entities/auction/store'

import { splittedAuctionSlotsApi } from '~entities/auction-slot/api'
import { auctionSlotsActions } from '~entities/auction-slot/store'

import { splittedDonationApi } from '~entities/donation/api'

import { splittedIntegrationsApi } from '~entities/integrations/api'

import type { AuctionDTO } from '~shared/api/http/auction'
import type { AuctionSlotsDTO } from '~shared/api/http/auction-slots'

import type { ErrorStatusesWithReason } from '~shared/constants/router'
import { errorStatusReasons } from '~shared/constants/router'

import { isError } from '~shared/utils'

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

  const getAuctionInfoPromise = splittedAuctionApi.endpoints.getAuctionInfo.initiate({ auctionUUID })
  const getDonationsStatusesStatsPromise = splittedDonationApi.endpoints.getDonationsStats.initiate({ auctionUUID })
  const getConnectedIntegrationsStatsPromise = splittedIntegrationsApi.endpoints.getConnectedIntegrations.initiate({ auctionUUID })
  const getAuctionSlotsPromise = splittedAuctionSlotsApi.endpoints.getAuctionSlots.initiate({ auctionUUID })

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

    const auctionInfo = responses[0].data as AuctionDTO
    const auctionSlots = responses[3].data as AuctionSlotsDTO[]

    if (!auctionInfo || Object.keys(auctionInfo).length === 0) {
      throw json({
        reason: 'Аукцион не найден',
      }, { status: 404 })
    }

    const alivedSlotsIds = auctionSlots.reduce<number[]>((result, slot) => {
      const isSlotNotDropped = auctionInfo.dropoutSlotsIds.find(id => id === slot.id) === undefined

      if (isSlotNotDropped) {
        result.push(slot.id)
      }

      return result
    }, [])

    dispatch(auctionActions.setAuction(auctionInfo))

    dispatch(auctionSlotsActions.updateAlivedSlotsIds({ data: alivedSlotsIds, mode: 'add' }))
    dispatch(auctionSlotsActions.updateDroppedSlotsIds({ data: auctionInfo.dropoutSlotsIds, mode: 'add' }))

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

    throw json({
      reason: typeof error === 'object' && error !== null ? 'message' in error ? error.message : '' : '',
      hint: 'Неизвестная ошибка. Если есть возможность напишите об этом на Github проекта в issues',
    }, {
      status: 400,
    })

    return null
  }
}
