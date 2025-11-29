import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { auctionDonationsPageRoute } from '~pages/auction-donations/routing'
import { auctionSettingsPageRoute } from '~pages/auction-settings/routing'
import { auctionSlotsPageRoute } from '~pages/auction-slots/routing'
import { auctionWheelPageRoute } from '~pages/auction-wheel/routing'
import { redirectPageRoute } from '~pages/redirect/routing'
import { welcomePageRoute } from '~pages/welcome/routing'

import { Toaster } from '~shared/ui/toaster'

import { errorPageRoute } from '../../pages/error/routing'
import { prepareDashboardRoute } from './prepate-dashboard.route'

const WelcomePageRouteObject = welcomePageRoute()
const AuctionSlotsRouteObject = auctionSlotsPageRoute({ disableTransition: true })
const AuctionWheelRouteObject = auctionWheelPageRoute({ disableTransition: true })
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
          ErrorPageRouteObject,
          {
            path: 'dashboard/:auctionId',
            children: [
              prepareDashboardRoute([
                RedirectRouteObject,
                { index: true, element: <Navigate to="slots" /> },
                AuctionSlotsRouteObject,
                AuctionWheelRouteObject,
                AuctionSettingsRouteObject,
                AuctionDonationsRouteObject,
                { path: '*', element: <Navigate to="slots" /> },
              ]),
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
])

export { browserRouter }
