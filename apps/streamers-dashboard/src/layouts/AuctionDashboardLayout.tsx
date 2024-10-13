import {PropsWithChildren} from 'react';
import Header from '../shared/components/ui/Header/Header';
import DashboardMenu from '../shared/components/ui/Menu/DashboardMenu';

const AuctionDashboardLayout = ({children}: PropsWithChildren) => {
  return (
    <>
      <Header />
      <DashboardMenu className="absolute top-1/2 -translate-y-1/2 left-4" />
      <main className="h-full w-full">
        <div className="h-full w-full px-4 mt-4">{children}</div>
      </main>
    </>
  );
};

export default AuctionDashboardLayout;
