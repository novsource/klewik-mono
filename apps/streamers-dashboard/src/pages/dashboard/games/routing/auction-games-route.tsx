import type { NonIndexRouteObject } from 'react-router-dom'

import { lazyLoadModule } from '~shared/lib/react-router-dom'

import { AnimatedRoute } from '~shared/router'

import AuctionGamesPage from '../ui/auction-games-page'

type AuctionGamesPageRouteProps = Partial<
  NonIndexRouteObject & {
    disableTransition: boolean
    enableLazyLoading: boolean
  }
>

const AUCTION_SLOTS_ROUTE_PATH = 'games'

export const auctionGamesPageRoute = (
  options?: AuctionGamesPageRouteProps,
): NonIndexRouteObject => {
  if (options?.enableLazyLoading) {
    return {
      path: AUCTION_SLOTS_ROUTE_PATH,
      lazy: () => lazyLoadModule('../ui/auction-games-page'),
      ...options,
    }
  }

  return {
    path: AUCTION_SLOTS_ROUTE_PATH,
    element: options?.disableTransition
      ? (
          <AuctionGamesPage />
        )
      : (
          <AnimatedRoute>
            <AuctionGamesPage />
          </AnimatedRoute>
        ),
    ...options,
  }
}
