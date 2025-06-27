import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { DashboardLayout } from '~app/layouts'

import { auctionDonationsPageRoute } from '~pages/auction-donations/routing'
import { auctionSettingsPageRoute } from '~pages/auction-settings/routing'
import { auctionSlotsPageRoute } from '~pages/auction-slots/routing'
import { auctionWheelPageRoute } from '~pages/auction-wheel/routing'
import { redirectPageRoute } from '~pages/redirect/routing'
import { welcomePageRoute } from '~pages/welcome/routing'

import { Toaster } from '~shared/ui/toaster'

import { prepareDashboardRoute } from './prepate-dashboard.route'

const WelcomePageRouteObject = welcomePageRoute()
const AuctionSlotsRouteObject = auctionSlotsPageRoute()
const AuctionWheelRouteObject = auctionWheelPageRoute()
const AuctionSettingsRouteObject = auctionSettingsPageRoute()
const AuctionDonationsRouteObject = auctionDonationsPageRoute()
const RedirectRouteObject = redirectPageRoute()

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
          {
            path: 'dashboard/:auctionId',
            children: [
              prepareDashboardRoute([
                RedirectRouteObject,
                { index: true, element: <Navigate to="slots" /> },
                {
                  element: <DashboardLayout />,
                  children: [
                    AuctionSlotsRouteObject,
                    AuctionWheelRouteObject,
                    AuctionSettingsRouteObject,
                    AuctionDonationsRouteObject,
                    { path: '*', element: <Navigate to="slots" /> },
                  ],
                },
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
