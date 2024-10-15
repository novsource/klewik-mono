import {PropsWithChildren} from 'react';
import Header from '../components/ui/Header/Header';
import DashboardMenu from '../components/ui/Menu/DashboardMenu';

const AuctionDashboardLayout = ({children}: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main className="h-full w-full">
        <div className="px-2 w-full h-full">
          <div className="flex w-full h-full">
            <aside className="w-16 h-full flex-none">
              <DashboardMenu className="absolute top-1/2 -translate-y-1/2 left-2" />
            </aside>
            <div className="h-full w-full px-4 flex-shrink-[2]">{children}</div>
            <div className="min-w-[300px] w-[500px] h-full">
              <div className="h-full bg-dark rounded-large"></div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AuctionDashboardLayout;
