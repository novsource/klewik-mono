import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import AuctionDashboardLayout from './layouts/AuctionDashboardLayout'
import WelcomePage from '@/pages/WelcomePage/WelcomePage'
import AuctionWheelPage from '@/pages/AuctionWheelPage/AuctionWheelPage'
import AnimatedRoute from './AnimatedRoute'
import AuctionSlotsPage from '@/pages/AuctionSlotsPage/AuctionSlotsPage'

type RoutesElements = {
  path: string
  element?: JSX.Element
  lazy?: {
    func(): Promise<{ Component: any }>
    isEnabled: boolean
  }
}

const auctionDashboardLayoutRoutes: RoutesElements[] = [
  {
    path: 'wheel',
    element: (
      <AnimatedRoute>
        <AuctionWheelPage />
      </AnimatedRoute>
    ),
    lazy: {
      func: async () => {
        const comp = await import('@/pages/AuctionWheelPage/index')
        return { Component: comp.AuctionWheelPage }
      },
      isEnabled: false,
    },
  },
  {
    path: 'slots',
    element: (
      <AnimatedRoute>
        <AuctionSlotsPage />
      </AnimatedRoute>
    ),
    lazy: {
      func: async () => {
        const comp = await import('@/pages/AuctionSlotsPage/index')
        return { Component: comp.AuctionSlotsPage }
      },
      isEnabled: false,
    },
  },
  { path: 'donations' },
  { path: 'settings' },
  { path: '*', element: <Navigate to="wheel" /> },
]

const routes = createRoutesFromElements(
  <Route>
    <Route path="/">
      <Route index element={<WelcomePage />} />
      <Route path="dashboard/:id">
        <Route index element={<Navigate to="wheel" />} />
        <Route element={<AuctionDashboardLayout />}>
          {auctionDashboardLayoutRoutes.map((route) => (
            <Route
              path={route.path}
              element={route.element}
              lazy={route.lazy?.isEnabled ? route.lazy.func : undefined}
            />
          ))}
          {/* <Route
            path="wheel"
            lazy={async () => {
              const comp = await import('@/pages/AuctionWheelPage/index')
              return { Component: comp.AuctionWheelPage }
            }}
          />
          <Route path="donations" />
          <Route
            path="slots"
            lazy={async () => {
              const comp = await import('@/pages/AuctionSlotsPage/index')
              return { Component: comp.AuctionSlotsPage }
            }}
          />
          <Route path="settings" />
          <Route path="*" element={<Navigate to="wheel" />} /> */}
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" />} />
  </Route>
)

export const router = createBrowserRouter(routes)
