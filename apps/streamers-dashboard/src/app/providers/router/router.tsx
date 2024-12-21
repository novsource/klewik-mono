import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'

import { auctionSlotsPageRoute } from '~pages/auction-slots/routing'
import { auctionWheelPageRoute } from '~pages/auction-wheel/routing'
import { welcomePageRoute } from '~pages/welcome/routing'

import { Toaster } from '~shared/ui/toaster'

import { AuctionDashboardLayout } from './layouts'

const welcomePageRouteObject = welcomePageRoute()
const auctionSlotsRouteObject = auctionSlotsPageRoute()
const auctionWheelRouteObject = auctionWheelPageRoute()

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
          welcomePageRouteObject,
          {
            path: 'dashboard/:slug',
            children: [
              { index: true, element: <Navigate to={'wheel'} /> },
              {
                element: <AuctionDashboardLayout />,
                // lazy: () =>
                //   lazyLoadModule(
                //     '~app/providers/router/layouts/auction-dashboard-layout'
                //   ),
                children: [
                  auctionSlotsRouteObject,
                  auctionWheelRouteObject,
                  { path: 'donations' },
                  { path: 'settings' },
                  { path: '*', element: <Navigate to={'wheel'} /> },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to={'/'} /> },
    ],
  },
])

export { browserRouter }
