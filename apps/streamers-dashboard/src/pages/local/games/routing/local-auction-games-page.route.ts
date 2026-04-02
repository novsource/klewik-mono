import type { NonIndexRouteObject } from 'react-router-dom'

export const LocalAuctionGamesPageRoute: NonIndexRouteObject = {
  path: 'games',
  lazy: () => import('../ui/local-auction-games-page.ui').then(module => ({ Component: module.LocalAuctionGamesPage })),
}
