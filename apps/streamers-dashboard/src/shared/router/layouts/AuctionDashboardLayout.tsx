import {Outlet} from 'react-router-dom';

import {Header, DashboardMenu} from '@ui/index';
import {Icons} from '@ui/icons';

const AuctionDashboardLayout = () => {
  return (
    <>
      <Header>
        <button className="rounded-[12px] h-10 bg-dark px-3 py-2 font-semibold text-gray-accent flex gap-x-1 items-center">
          <Icons.Timer width={21} height={21} />
          Timer
        </button>
      </Header>
      <main className="main--dashboard">
        <div className="px-2 w-full h-full">
          <div className="flex w-full h-full">
            <aside className="w-16 h-full flex-none">
              <DashboardMenu className="absolute top-1/2 -translate-y-1/2 left-2" />
            </aside>
            {<Outlet />}
          </div>
        </div>
      </main>
    </>
  );
};

export default AuctionDashboardLayout;
