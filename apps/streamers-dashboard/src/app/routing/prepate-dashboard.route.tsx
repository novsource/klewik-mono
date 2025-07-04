import type {
  RouteObject,
} from 'react-router-dom'
import {
  isRouteErrorResponse,
  json,
  Link,
  Outlet,
  useRouteError,
} from 'react-router-dom'

import { AxiosError } from 'axios'
import { z } from 'zod'

import { store } from '~app/store'

import { ErrorPage } from '~pages/error/ui/error-page.ui'

import type { Auction } from '~entities/auction/model'
import { auctionActions } from '~entities/auction/store'

import { getAuctionInfo } from '~shared/api/http/auction/auction.api'
import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

const PrepareRouteErrorBoundary = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="relative container h-full mx-auto">
        <div className="absolute top-1/4 -translate-y-1/4 w-full px-4">
          <div className="flex flex-col h-full items-start justify-center gap-y-8">
            <Icons.Logo className="text-green-accent" width={48} height={48} />
            <div className="flex flex-col gap-y-1">
              <Typography className="text-[42px] font-golos-f" tag="h1">
                Ошибка №
                {error.status}
              </Typography>
              <Typography
                className="font-medium text-title leading-5 font-golos-f"
                tag="span"
              >
                {error.data.reason}
              </Typography>
            </div>
            <Link to="/">
              <Button variant="action" startContent={<Icons.ReturnArrow />}>
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

const prepareDashboardRoute = (childrens: RouteObject[]): RouteObject => {
  return {
    element: <Outlet />,
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
          let reason = ''

          switch (error.status) {
            case 400: {
              reason = 'Ошибка в номере аукциона. Попробуйте войти через главную страницу'
              break
            }
            case 401: {
              reason = 'Аукциона с таким номером не существует или у вас нет к нему доступа'
              break
            }
            case 404: {
              reason = 'Аукциона не существует или был удален'
              break
            }
          }

          throw json(
            {
              reason,
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

export { prepareDashboardRoute }
