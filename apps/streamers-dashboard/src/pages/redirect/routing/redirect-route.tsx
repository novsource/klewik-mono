import type { NonIndexRouteObject } from 'react-router-dom'

import { lazyLoadModule } from '~shared/lib/react-router-dom'

import { AnimatedRoute } from '~shared/router'

import { RedirectPage } from '../ui'

type AuctionSlotsRouteProps = Partial<
  NonIndexRouteObject & {
    disableTransition: boolean
    enableLazyLoading: boolean
  }
>

const REDIRECT_ROUTE_PATH = 'redirect'

export const redirectPageRoute = (
  options?: AuctionSlotsRouteProps,
): NonIndexRouteObject => {
  if (options?.enableLazyLoading) {
    return {
      path: REDIRECT_ROUTE_PATH,
      lazy: () => lazyLoadModule('../ui/redirect-page'),
      ...options,
    }
  }

  return {
    path: REDIRECT_ROUTE_PATH,
    element: options?.disableTransition
      ? (
          <RedirectPage />
        )
      : (
          <AnimatedRoute>
            <RedirectPage />
          </AnimatedRoute>
        ),
    ...options,
  }
}
