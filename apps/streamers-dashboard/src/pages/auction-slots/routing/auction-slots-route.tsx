import { NonIndexRouteObject } from 'react-router-dom'

import { lazyLoadModule } from '~shared/lib/react-router-dom'

import { AnimatedRoute } from '~shared/router'

import { AuctionSlotsPage } from '../ui'

type AuctionSlotsRouteProps = Partial<
  NonIndexRouteObject & {
    disableTransition: boolean
    enableLazyLoading: boolean
  }
>

const AUCTION_SLOTS_ROUTE_PATH = 'slots'

export const auctionSlotsPageRoute = (
  options?: AuctionSlotsRouteProps
): NonIndexRouteObject => {
  if (options?.enableLazyLoading) {
    return {
      path: AUCTION_SLOTS_ROUTE_PATH,
      lazy: () => lazyLoadModule('../ui/auction-slots-page'),
      ...options,
    }
  }

  return {
    path: AUCTION_SLOTS_ROUTE_PATH,
    element: options?.disableTransition ? (
      <AuctionSlotsPage />
    ) : (
      <AnimatedRoute>
        <AuctionSlotsPage />
      </AnimatedRoute>
    ),
    ...options,
  }
}
