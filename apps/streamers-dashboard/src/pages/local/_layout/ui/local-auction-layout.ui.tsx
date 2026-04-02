import { Outlet } from 'react-router-dom'

import { DashboardHeader } from '~widgets/dashboard-header/ui'
import { MobileNavbar, Navbar } from '~widgets/dashboard-navbar/ui'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'

import { Flex } from 'klewik-ui/flex'

import { LOCAL_NAVBAR_LINKS } from '../constants/local-navbar-links'

export const LocalAuctionLayout = () => {
  return (
    <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>
      <div className="w-full h-full tablet:inline-flex tablet:h-auto">

        <MediaQueryViewToggler.MatchedItem>
          <aside className="sticky top-0 h-screen py-4 border-r-1 border-r-dark bg-dark-foreground-light">
            <Navbar links={LOCAL_NAVBAR_LINKS} />
          </aside>
        </MediaQueryViewToggler.MatchedItem>

        <Flex className="w-full h-full flex flex-col">
          <DashboardHeader />

          <main className="relative w-full overflow-y-scroll tablet:h-full tablet:overflow-x-hidden tablet:overflow-y-scroll">
            <Flex className="h-full w-full px-4">
              <Outlet />
            </Flex>
          </main>

          <MediaQueryViewToggler.NotMatchedItem>
            <MobileNavbar />
          </MediaQueryViewToggler.NotMatchedItem>

        </Flex>
      </div>
    </MediaQueryViewToggler>
  )
}
