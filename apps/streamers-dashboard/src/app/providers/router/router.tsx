import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'

import { auctionSettingsPageRoute } from '~pages/auction-settings/routing'
import { auctionSlotsPageRoute } from '~pages/auction-slots/routing'
import { auctionWheelPageRoute } from '~pages/auction-wheel/routing'
import { redirectPageRoute } from '~pages/redirect/routing'
import { welcomePageRoute } from '~pages/welcome/routing'

import { Toaster } from '~shared/ui/toaster'

import { AuctionDashboardLayout } from './layouts'
import { auctionPrepareRoute } from './routes'

const WelcomePageRouteObject = welcomePageRoute()
const AuctionSlotsRouteObject = auctionSlotsPageRoute()
const AuctionWheelRouteObject = auctionWheelPageRoute()
const AuctionSettingsRouteObject = auctionSettingsPageRoute()
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
              auctionPrepareRoute([
                RedirectRouteObject,
                { index: true, element: <Navigate to={'wheel'} /> },
                {
                  element: <AuctionDashboardLayout />,
                  children: [
                    AuctionSlotsRouteObject,
                    AuctionWheelRouteObject,
                    AuctionSettingsRouteObject,
                    { path: 'donations' },
                    { path: '*', element: <Navigate to={'wheel'} /> },
                  ],
                },
              ]),
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to={'/'} /> },
    ],
  },
])

export { browserRouter }
