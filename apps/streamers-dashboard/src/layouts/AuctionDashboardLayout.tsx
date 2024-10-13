import {PropsWithChildren} from 'react';
import Header from '../shared/components/ui/Header/Header';

const AuctionDashboardLayout = ({children}: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main className="h-full w-full">
        <div className="h-full w-full px-4 mt-4">{children}</div>
      </main>
    </>
  );
};

export default AuctionDashboardLayout;
