import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import AuctionWheelPage from '../../pages/AuctionWheelPage/AuctionWheelPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<div>Welcome page</div>} path="/" />
      <Route path="/dashboard/:auctionId">
        <Route path="wheel" element={<AuctionWheelPage />} />
        <Route path="donations" />
        <Route path="slots" />
        <Route path="settings" />
      </Route>
      <Route path="*" element={<div>Not found</div>} />
    </Route>
  )
);
