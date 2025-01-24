import { useEffect, useLayoutEffect, useState } from 'react'
import { Outlet, RouteObject, useNavigate, useParams } from 'react-router-dom'

import { SSEApiClient } from '~shared/api/sse'

import { appActions, appSelectors } from '~shared/store/slices'

import { useStoreDispatch, useStoreSelector } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Icons } from '~shared/ui/icons'

import { tailwindScreens } from '~shared/constants/tailwindcss'

const AuthPage = () => {
  const [isConnected, setIsConnected] = useState(false)

  const dispatch = useStoreDispatch()
  const auctionId = useStoreSelector(appSelectors.getAuctionId)

  const params = useParams()
  const navigate = useNavigate()

  const isLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet}px)`
  )

  useLayoutEffect(() => {
    if (!params['auctionId']) {
      navigate('/error')
    }
  }, [])

  useEffect(() => {
    if (!auctionId && params['auctionId']) {
      dispatch(appActions.setAuctionId(params['auctionId']))
    }
  }, [])

  useEffect(() => {
    if (auctionId) {
      SSEApiClient.getInstance().onConnect(() => {
        setIsConnected(true)
      })

      SSEApiClient.getInstance().onLeadership(() => {
        SSEApiClient.getInstance().onConnect(() => {
          SSEApiClient.getInstance().postMessage({
            id: '0',
            data: JSON.stringify({ status: true }),
            event: 'manager/status',
            retry: undefined,
          })
        })

        SSEApiClient.getInstance().connectToAllEvents(auctionId)
      })
    }
  }, [auctionId])

  return !isConnected ? (
    <div className="flex w-full h-full items-center justify-center animate-fadeIn">
      <Icons.Logo
        className="animate-bounce duration-700"
        width={isLargeThenTablet ? 64 : 42}
        height={isLargeThenTablet ? 64 : 42}
      />
    </div>
  ) : (
    <Outlet />
  )
}

export { AuthPage }
