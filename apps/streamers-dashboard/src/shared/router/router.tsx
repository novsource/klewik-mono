import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import AuctionDashboardLayout from './layouts/AuctionDashboardLayout';
import AuctionWheelPage from '@/pages/AuctionWheelPage/AuctionWheelPage';
import WelcomePage from '@/pages/WelcomePage/WelcomePage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/">
        <Route index element={<WelcomePage />} />
        <Route path="dashboard/:id">
          <Route index element={<Navigate to="wheel" />} />
          <Route element={<AuctionDashboardLayout />}>
            <Route path="wheel" element={<AuctionWheelPage />} />
            <Route path="donations" />
            <Route path="slots" />
            <Route path="settings" />
            <Route path="*" element={<Navigate to="wheel" />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  )
);
