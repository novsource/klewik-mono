import { Navigate, createBrowserRouter } from 'react-router-dom'

import { auctionSlotsPageRoute } from '~pages/auction-slots/routing'
import { auctionWheelPageRoute } from '~pages/auction-wheel/routing'
import { welcomePageRoute } from '~pages/welcome/routing'

import { lazyLoadModule } from '~shared/lib/react-router-dom'

import { AuctionDashboardLayout } from './layouts'

const welcomePageRouteObject = welcomePageRoute()
const auctionSlotsRouteObject = auctionSlotsPageRoute()
const auctionWheelRouteObject = auctionWheelPageRoute()

const browserRouter = createBrowserRouter([
  {
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

// const routes = createRoutesFromElements(
//   <Route>
//     <Route path="/">
//       {/* {test} */}
//       {/* <WelcomeRoute disableTransition={true} /> */}
//       <Route path="dashboard/:slug">
//         <Route index element={<Navigate to="wheel" />} />
//         <Route
//           element={<AuctionDashboardLayout />}
//           lazy={() => lazyLoadModule('./layouts/AuctionDashboardLayout')}
//         >
//           <Route path="donations" />
//           <Route path="settings" />
//           <Route path="*" element={<Navigate to="wheel" />} />
//         </Route>
//       </Route>
//     </Route>
//     <Route path="*" element={<Navigate to="/" />} />
//   </Route>
// )

// export const router = createBrowserRouter(routes)
export { browserRouter }
