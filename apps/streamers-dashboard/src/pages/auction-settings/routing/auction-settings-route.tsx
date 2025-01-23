import { NonIndexRouteObject } from 'react-router-dom'

import { lazyLoadModule } from '~shared/lib/react-router-dom'

import { AnimatedRoute } from '~shared/router'

import { AuctionSettingsPage } from '../ui'

type AuctionSlotsRouteProps = Partial<
  NonIndexRouteObject & {
    disableTransition: boolean
    enableLazyLoading: boolean
  }
>

const AUCTION_SETTINGS_ROUTE_PATH = 'settings'

export const auctionSettingsPageRoute = (
  options?: AuctionSlotsRouteProps
): NonIndexRouteObject => {
  if (options?.enableLazyLoading) {
    return {
      path: AUCTION_SETTINGS_ROUTE_PATH,
      lazy: () => lazyLoadModule('../ui/auction-settings-page'),
      ...options,
    }
  }

  return {
    path: AUCTION_SETTINGS_ROUTE_PATH,
    element: options?.disableTransition ? (
      <AuctionSettingsPage />
    ) : (
      <AnimatedRoute>
        <AuctionSettingsPage />
      </AnimatedRoute>
    ),
    ...options,
  }
}
