import type { NonIndexRouteObject } from 'react-router-dom'

type WelcomePageRouteProps = Partial<NonIndexRouteObject>

const AUCTION_SLOTS_ROUTE_PATH = '/'

export function welcomePageRoute(options?: WelcomePageRouteProps): NonIndexRouteObject {
  return {
    path: AUCTION_SLOTS_ROUTE_PATH,
    lazy: () => import('../ui/welcome-page').then(module => ({ Component: module.WelcomePage })),
    ...options,
  }
}
