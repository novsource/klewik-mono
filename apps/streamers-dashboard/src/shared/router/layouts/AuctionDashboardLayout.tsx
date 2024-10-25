import { Outlet } from 'react-router-dom'

import { Header, DashboardMenu } from '@ui/index'
import { Icons } from '@ui/icons'

const AuctionDashboardLayout = () => {
  return (
    <>
      <Header>
        <button className="flex h-10 items-center gap-x-1 rounded-[12px] bg-dark px-3 py-2 font-semibold text-gray-accent">
          <Icons.Timer width={21} height={21} />
          Timer
        </button>
      </Header>
      <main className="main--dashboard">
        <div className="h-full w-full px-2">
          <div className="flex h-full w-full">
            <aside className="h-full w-16 flex-none">
              <DashboardMenu className="absolute left-2 top-1/2 -translate-y-1/2" />
            </aside>
            {<Outlet />}
          </div>
        </div>
      </main>
    </>
  )
}

export default AuctionDashboardLayout
