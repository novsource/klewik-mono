import type { NonIndexRouteObject } from 'react-router-dom'

export const LocalAuctionSlotsPageRoute: NonIndexRouteObject = {
  path: 'slots',
  lazy: () => import('../ui/local-auction-slots-page.ui').then(module => ({ Component: module.LocalAuctionSlotsPage })),
}
