import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { GlobalDialogs } from '~app/components/global-dialogs/ui/global-dialogs.ui'

import { auctionDonationsPageRoute } from '~pages/dashboard/donations/routing'
import { auctionWheelPageRoute } from '~pages/dashboard/games/routing'
import { auctionSlotsPageRoute } from '~pages/dashboard/slots/routing'
import { LocalAuctionLayout } from '~pages/local/_layout'
import { LocalAuctionGamesPageRoute } from '~pages/local/games/routing/local-auction-games-page.route'
import { LocalAuctionSlotsPageRoute } from '~pages/local/slots'
import { redirectPageRoute } from '~pages/redirect/routing'
import { welcomePageRoute } from '~pages/welcome/routing'

import { Toaster } from 'klewik-ui/toaster'

import { errorPageRoute } from '../../pages/error/routing'
import { prepareDashboardRoute } from './prepate-dashboard.route'

const WelcomePageRouteObject = welcomePageRoute()
const AuctionSlotsRouteObject = auctionSlotsPageRoute()
const AuctionGamesRouteObject = auctionWheelPageRoute()

const AuctionDonationsRouteObject = auctionDonationsPageRoute()
const RedirectRouteObject = redirectPageRoute()
const ErrorPageRouteObject = errorPageRoute()

const browserRouter = createBrowserRouter([
  {
    element: (
      <>
        <Outlet />
        <Toaster />
      </>
    ),
    children: [
      {
        path: '/',
        children: [
          WelcomePageRouteObject,
          RedirectRouteObject,
          {
            path: 'dashboard/:auctionUUID',
            children: [
              prepareDashboardRoute([
                { index: true, element: <Navigate to="slots" /> },
                AuctionSlotsRouteObject,
                AuctionGamesRouteObject,
                AuctionDonationsRouteObject,
                { path: '*', element: <Navigate to="slots" /> },
              ]),
            ],
          },
          {
            path: 'local',
            element: <>
              <LocalAuctionLayout />
              <GlobalDialogs />
            </>,
            children: [
              { index: true, element: <Navigate to="slots" /> },
              { path: '*', element: <Navigate to="slots" /> },
              LocalAuctionSlotsPageRoute,
              LocalAuctionGamesPageRoute,
            ],
          },
          ErrorPageRouteObject,
        ],
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
])

export { browserRouter }
