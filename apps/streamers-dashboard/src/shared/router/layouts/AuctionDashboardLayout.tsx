import {Outlet} from 'react-router-dom';

import {Header, DashboardMenu} from '@ui/index';

const AuctionDashboardLayout = () => {
  return (
    <>
      <Header />
      <main className="h-full w-full">
        <div className="px-2 w-full h-full">
          <div className="flex w-full h-full">
            <aside className="w-16 h-full flex-none">
              <DashboardMenu className="absolute top-1/2 -translate-y-1/2 left-2" />
            </aside>
            <div className="h-full w-full px-4 flex-shrink-[2]">
              {<Outlet />}
            </div>
            <div className="min-w-[300px] w-[500px] h-full py-5">
              <div className="h-full flex flex-col gap-y-4">
                <button className="bg-green text-white font-semibold text-title px-5 py-3 rounded-medium">
                  Spin wheel
                </button>
                <div className="h-full bg-dark rounded-large"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AuctionDashboardLayout;
