import { Outlet } from 'react-router-dom'

import { Header, DashboardMenu } from '@ui/index'
import { Icons } from '@ui/icons'
import { Button } from '@ui/Button/button'

const AuctionDashboardLayout = () => {
  return (
    <>
      <Header>
        <Button startContent={<Icons.Timer width={24} height={24} />}>
          Timer
        </Button>
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
