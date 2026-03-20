import type { NonIndexRouteObject } from 'react-router-dom'

type AuctionSlotsRouteProps = Partial<NonIndexRouteObject>

const AUCTION_SLOTS_ROUTE_PATH = 'slots'

export const auctionSlotsPageRoute = (options?: AuctionSlotsRouteProps): NonIndexRouteObject => {
  return {
    path: AUCTION_SLOTS_ROUTE_PATH,
    lazy: () => import('../ui/auction-slots-page.ui').then(module => ({ Component: module.AuctionSlotsPage })),
    ...options,
  }
}
