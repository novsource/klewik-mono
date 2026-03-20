import type { NonIndexRouteObject } from 'react-router-dom'

type AuctionSlotsRouteProps = Partial<NonIndexRouteObject>

const AUCTION_DONATIONS_ROUTE_PATH = 'donations'

export const auctionDonationsPageRoute = (options?: AuctionSlotsRouteProps): NonIndexRouteObject => {
  return {
    path: AUCTION_DONATIONS_ROUTE_PATH,
    lazy: () => import('../ui/auction-donations-page').then(module => ({ Component: module.AuctionDonationsPage })),
    ...options,
  }
}
