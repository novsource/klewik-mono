import type { NonIndexRouteObject } from 'react-router-dom'

type AuctionSlotsRouteProps = Partial<NonIndexRouteObject>

const REDIRECT_ROUTE_PATH = 'redirect'

export const redirectPageRoute = (
  options?: AuctionSlotsRouteProps,
): NonIndexRouteObject => {
  return {
    path: REDIRECT_ROUTE_PATH,
    lazy: () => import('../ui/redirect-page').then(module => ({ Component: module.RedirectPage })),
    ...options,
  }
}
