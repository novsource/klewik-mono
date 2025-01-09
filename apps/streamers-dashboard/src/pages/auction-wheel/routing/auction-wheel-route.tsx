import { NonIndexRouteObject } from 'react-router-dom'

import { lazyLoadModule } from '~shared/lib/react-router-dom'

import { AnimatedRoute } from '~shared/router'

import { AuctionWheelPage } from '../ui'

type AuctionWheelPageRouteProps = Partial<
  NonIndexRouteObject & {
    disableTransition: boolean
    enableLazyLoading: boolean
  }
>

const AUCTION_SLOTS_ROUTE_PATH = 'wheel'

export const auctionWheelPageRoute = (
  options?: AuctionWheelPageRouteProps
): NonIndexRouteObject => {
  if (options?.enableLazyLoading) {
    return {
      path: AUCTION_SLOTS_ROUTE_PATH,
      lazy: () => lazyLoadModule('../ui/auction-wheel-page'),
      ...options,
    }
  }

  return {
    path: AUCTION_SLOTS_ROUTE_PATH,
    element: options?.disableTransition ? (
      <AuctionWheelPage />
    ) : (
      <AnimatedRoute>
        <AuctionWheelPage />
      </AnimatedRoute>
    ),
    ...options,
  }
}
