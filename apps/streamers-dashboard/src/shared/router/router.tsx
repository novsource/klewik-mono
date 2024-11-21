import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import AuctionDashboardLayout from './layouts/AuctionDashboardLayout'
import WelcomePage from '@/pages/WelcomePage/WelcomePage'

const routes = createRoutesFromElements(
  <Route>
    <Route path="/">
      <Route index element={<WelcomePage />} />
      <Route path="dashboard/:id">
        <Route index element={<Navigate to="wheel" />} />
        <Route element={<AuctionDashboardLayout />}>
          <Route
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
          <Route path="*" element={<Navigate to="wheel" />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" />} />
  </Route>
)

export const router = createBrowserRouter(routes)
