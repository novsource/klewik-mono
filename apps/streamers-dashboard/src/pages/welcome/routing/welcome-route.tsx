import { NonIndexRouteObject } from 'react-router-dom'

import { lazyLoadModule } from '~shared/lib/react-router-dom'

import { AnimatedRoute } from '~shared/router'

import { WelcomePage } from '../ui'

type WelcomePageRouteProps =
  | Partial<
      NonIndexRouteObject & {
        disableTransition: boolean
        enableLazyLoading: boolean
      }
    >
  | undefined

const AUCTION_SLOTS_ROUTE_PATH = '/'

export function welcomePageRoute(
  options?: WelcomePageRouteProps
): NonIndexRouteObject {
  if (options?.enableLazyLoading) {
    return {
      path: AUCTION_SLOTS_ROUTE_PATH,
      lazy: () => lazyLoadModule('../ui/welcome-page'),
      ...options,
    }
  }

  return {
    path: AUCTION_SLOTS_ROUTE_PATH,
    element: options?.disableTransition ? (
      <WelcomePage />
    ) : (
      <AnimatedRoute>
        <WelcomePage />
      </AnimatedRoute>
    ),
    ...options,
  }
}
