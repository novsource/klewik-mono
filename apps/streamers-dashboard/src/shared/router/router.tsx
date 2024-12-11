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

/**
 * Lazy component loading for React Router
 * @description If warning, read this title: https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
 * @param modulePath
 */

const lazyLoadModule = async (modulePath: string) => {
  if (modulePath === '' || modulePath.length === 0) {
    throw Error()
  }

  /* @vite-ignore */
  const comp = await import(`${modulePath}.tsx`)

  const moduleProps = Object.getOwnPropertyNames(comp)
  const isDefaultImport = moduleProps.includes('default')

  const loadedModule = isDefaultImport ? comp.default : comp[moduleProps[0]]

  return {
    Component: loadedModule,
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
      <Route
        index
        element={<WelcomePage />}
        lazy={async () =>
          await lazyLoadModule('../../pages/WelcomePage/WelcomePage')
        }
      />
      <Route path="dashboard/:id">
        <Route index element={<Navigate to="wheel" />} />
        <Route
          element={<AuctionDashboardLayout />}
          lazy={async () =>
            await lazyLoadModule('./layouts/AuctionDashboardLayout')
          }
        >
          {auctionDashboardLayoutRoutes.map((route) => (
            <Route
              path={route.path}
              element={route.element}
              lazy={route.lazy?.isEnabled ? route.lazy.func : undefined}
            />
          ))}
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" />} />
  </Route>
)

export const router = createBrowserRouter(routes)
