import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import AuctionWheelPage from '../../pages/AuctionWheelPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<div>Welcome page</div>} path="/" />
      <Route element={<AuctionWheelPage />} path="/dashboard/:id" />
    </Route>
  )
);
