import type { NonIndexRouteObject } from 'react-router-dom'

type AuctionGamesPageRouteProps = Partial<NonIndexRouteObject>

const AUCTION_SLOTS_ROUTE_PATH = 'games'

export const auctionGamesPageRoute = (options?: AuctionGamesPageRouteProps): NonIndexRouteObject => {
  return {
    path: AUCTION_SLOTS_ROUTE_PATH,
    lazy: () => import('../ui/auction-games-page').then(module => ({ Component: module.AuctionGamesPage })),
    ...options,
  }
}
