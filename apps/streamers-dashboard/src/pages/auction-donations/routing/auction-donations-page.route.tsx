import { NonIndexRouteObject } from 'react-router-dom'

import { lazyLoadModule } from '~shared/lib/react-router-dom'

import { AnimatedRoute } from '~shared/router'

import { AuctionDonationsPage } from '../ui'

type AuctionSlotsRouteProps = Partial<
  NonIndexRouteObject & {
    disableTransition: boolean
    enableLazyLoading: boolean
  }
>

const AUCTION_DONATIONS_ROUTE_PATH = 'donations'

export const auctionDonationsPageRoute = (
  options?: AuctionSlotsRouteProps
): NonIndexRouteObject => {
  if (options?.enableLazyLoading) {
    return {
      path: AUCTION_DONATIONS_ROUTE_PATH,
      lazy: () => lazyLoadModule('../ui/auction-donations-page'),
      ...options,
    }
  }

  return {
    path: AUCTION_DONATIONS_ROUTE_PATH,
    element: options?.disableTransition ? (
      <AuctionDonationsPage />
    ) : (
      <AnimatedRoute>
        <AuctionDonationsPage />
      </AnimatedRoute>
    ),
    ...options,
  }
}
