import { useCallback, useEffect, useState } from 'react'
import {
  Link,
  Outlet,
  RouteObject,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from 'react-router-dom'

import { AxiosError } from 'axios'
import { z } from 'zod'

import { store } from '~app/providers/store/store'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions } from '~entities/auction-slot/store'
import { Auction } from '~entities/auction/model'
import { auctionActions } from '~entities/auction/store'
import { Donation } from '~entities/donation/model'
import { donationsActions } from '~entities/donation/store'

import { getAuctionInfo } from '~shared/api/http/auction/auction.api'
import { SSEApiClient } from '~shared/api/sse'

import { appActions, appSelectors } from '~shared/store/slices'

import { useStoreDispatch, useStoreSelector } from '~shared/lib/redux-toolkit'

import { useLocalStorage } from '~shared/hooks/use-local-storage'
import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { toastPromiseNotification } from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'

import { tailwindScreens } from '~shared/constants/tailwindcss'

const AuctionPrepare = () => {
  const auctionId = useStoreSelector(appSelectors.getAuctionId)
  const dispatch = useStoreDispatch()

  const loaderData = useLoaderData() as Auction

  const slotsLastMessageId = useLocalStorage('slots:last-message-id')
  const donationsLastMessageId = useLocalStorage('donations:last-message-id')

  const [isConnected, setIsConnected] = useState(false)

  const isLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet}px)`
  )

  const connectToSSE = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      SSEApiClient.init(loaderData.id).connectToAllEvents({
        slotsLastMessageId: slotsLastMessageId.value,
        donationsLastMessageId: donationsLastMessageId.value,
      })

      SSEApiClient.getInstance().onConnect(() => {
        console.log('here')
        resolve()
      })
    })
  }, [])

  useEffect(() => {
    if (slotsLastMessageId.value === undefined) {
      slotsLastMessageId.set(0)
    }

    if (donationsLastMessageId.value === undefined) {
      donationsLastMessageId.set(0)
    }
  }, [])

  useEffect(() => {
    const request = connectToSSE()

    if (request === undefined) return

    toastPromiseNotification(
      request.catch(console.log),
      'Подключение к серверу...',
      {
        successText: 'Подключение к серверу',
        errorText: 'Не удалось подключиться к серверу',
        onSuccess: () => {
          setIsConnected(true)
        },
      }
    )
  }, [connectToSSE])

  useEffect(() => {
    const dispatchSlots = (slots: AuctionSlot[]) =>
      dispatch(auctionSlotsActions.addSlots(slots))
    const dispatchDonation = (donation: Donation) =>
      dispatch(donationsActions.addDonation(donation))

    SSEApiClient.getInstance()
      .auctionSlots()
      .on('onmessage', ({ id }) => {
        slotsLastMessageId.set(Number(id))
      })

    SSEApiClient.getInstance()
      .donations()
      .on('onmessage', ({ id }) => {
        slotsLastMessageId.set(Number(id))
      })

    SSEApiClient.getInstance().auctionSlots().onAddingSlots(dispatchSlots)
    SSEApiClient.getInstance().donations().onNewDonation(dispatchDonation)

    return () => {
      SSEApiClient.getInstance()
        .auctionSlots()
        .removeListener('auction-slots/add', dispatchSlots)

      SSEApiClient.getInstance()
        .donations()
        .removeListener('donations/add', dispatchDonation)
    }
  }, [auctionId])

  return !isConnected ? (
    <div className="flex w-full h-full items-center justify-center animate-fade-in duration-[3s]">
      <Icons.Logo
        className="animate-bounce duration-1000 text-green-accent"
        width={isLargeThenTablet ? 58 : 36}
        height={isLargeThenTablet ? 58 : 36}
      />
    </div>
  ) : (
    <Outlet />
  )
}

const PrepareRouteErrorBoundary = () => {
  let error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="relative container h-full mx-auto">
        <div className="absolute top-1/4 -translate-y-1/4 w-full px-4">
          <div className="flex flex-col h-full items-start justify-center gap-y-8">
            <Icons.Logo className="text-green-accent" width={48} height={48} />
            <div className="flex flex-col gap-y-1">
              <Typography className="text-[42px] font-golos-f" tag="h1">
                Ошибка №{error.status}
              </Typography>
              <Typography
                className="font-medium text-title leading-5 font-golos-f"
                tag="span"
              >
                {error.data.reason}
              </Typography>
            </div>
            <Link to="/">
              <Button variant={'action'} startContent={<Icons.ReturnArrow />}>
                Вернуться на главную страницу
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  throw error
}

const auctionPrepareRoute = (childrens: RouteObject[]): RouteObject => {
  return {
    element: <AuctionPrepare />,
    loader: async ({ params }) => {
      const validatedParams = z
        .object({ auctionId: z.string().uuid() })
        .safeParse(params)

      if (!validatedParams.success) {
        throw json(
          {
            reason: 'Некорректный номер аукциона',
            hint: 'Попробуйте войти в аукцион через главную страницу',
          },
          { status: 400 }
        )
      }

      try {
        const dispatch = store.dispatch

        const response = await getAuctionInfo<Auction>(
          validatedParams.data.auctionId
        )

        dispatch(auctionActions.setAuction(response.data))
        dispatch(appActions.setAuctionId(response.data.id))

        return response.data
      } catch (err) {
        if (err instanceof AxiosError) {
          throw json(
            {
              reason:
                'Аукциона с таким номером не существует или у вас нет к нему доступа',
            },
            {
              status: 404,
            }
          )
        }
      }
    },
    errorElement: <PrepareRouteErrorBoundary />,
    children: childrens,
  }
}

export { auctionPrepareRoute }
