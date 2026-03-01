import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { auctionSettingsPageRoute } from '~pages/auction-settings/routing'
import { auctionDonationsPageRoute } from '~pages/dashboard/donations/routing'
import { auctionWheelPageRoute } from '~pages/dashboard/games/routing'
import { auctionSlotsPageRoute } from '~pages/dashboard/slots/routing'
import { redirectPageRoute } from '~pages/redirect/routing'
import { welcomePageRoute } from '~pages/welcome/routing'

import { Toaster } from '~shared/ui/toaster'

import { errorPageRoute } from '../../pages/error/routing'
import { prepareDashboardRoute } from './prepate-dashboard.route'

const WelcomePageRouteObject = welcomePageRoute()
const AuctionSlotsRouteObject = auctionSlotsPageRoute({ disableTransition: true })
const AuctionGamesRouteObject = auctionWheelPageRoute({ disableTransition: true })
const AuctionSettingsRouteObject = auctionSettingsPageRoute({ disableTransition: true })
const AuctionDonationsRouteObject = auctionDonationsPageRoute({ disableTransition: true })
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
                AuctionSettingsRouteObject,
                AuctionDonationsRouteObject,
                { path: '*', element: <Navigate to="slots" /> },
              ]),
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
