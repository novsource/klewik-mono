import { Outlet } from 'react-router-dom'

import { NavbarMenu } from '~widgets/navbar-menu'

import { tailwindScreens } from '~shared/constants/tailwindcss'
import { useMediaQuery } from '~shared/hooks/use-media-query'
import { Header } from '~shared/ui/header'

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
                <NavbarMenu className="absolute left-2 top-1/2 -translate-y-1/2" />
              </aside>
            )}
            <Outlet />
          </div>
        </div>
      </main>
      {!isTablet && (
        <footer className="fixed bottom-0 w-full">
          <NavbarMenu className="h-full w-full" />
        </footer>
      )}
    </>
  )
}

export default AuctionDashboardLayout
