import { Outlet } from 'react-router-dom'

import { Header, DashboardMenu } from '@ui/index'
import { useMediaQuery } from '@hooks/useMediaQuery'
import { tailwindScreens } from '@/lib/constants/twScreens'

const AuctionDashboardLayout = () => {
  const isTablet = useMediaQuery(`(min-width:${tailwindScreens.tablet})`)

  return (
    <>
      <Header />
      <main className="main--dashboard">
        <div className="h-full w-full px-4">
          <div className="flex h-full w-full">
            {isTablet && (
              <aside className="h-full w-16 flex-none">
                <DashboardMenu className="absolute left-2 top-1/2 -translate-y-1/2" />
              </aside>
            )}
            <Outlet />
          </div>
        </div>
      </main>
      {!isTablet && (
        <footer className="fixed bottom-0 w-full">
          <DashboardMenu className="h-full w-full" />
        </footer>
      )}
    </>
  )
}

export default AuctionDashboardLayout
