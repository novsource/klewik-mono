import { useLayoutEffect } from 'react'

import { Outlet, useParams } from 'react-router-dom'

import { MobileDashboardFooter } from '~widgets/dashboard-footer/ui'
import { DashboardHeader } from '~widgets/dashboard-header/ui'
import { DesktopNavbar, MobileNavbar } from '~widgets/dashboard-navbar/ui'

import type { Auction } from '~entities/auction/model'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'

import { useMediaQuery } from '~shared/hooks'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { useDashboardLayout } from '../hooks/use-dashboard-layout'

export const DashboardLayout = () => {
  const { auctionUUID } = useParams() as { auctionUUID: Auction['auctionUUID'] }

  const { isSSEConnected } = useDashboardLayout(auctionUUID)

  if (!isSSEConnected) {
    return <DashboardLayoutLoader />
  }

  return (
    <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>
      <div className="w-full h-full tablet:inline-flex tablet:h-auto">

        <MediaQueryViewToggler.MatchedItem>
          <aside className="sticky top-0 h-screen py-4 border-r-1 border-r-dark bg-dark-foreground-light">
            <DesktopNavbar />
          </aside>
        </MediaQueryViewToggler.MatchedItem>

        <Flex className="w-full h-full flex flex-col">
          <DashboardHeader />
          <DashboardLayoutContent />

          <MediaQueryViewToggler.NotMatchedItem>
            <MobileNav />
          </MediaQueryViewToggler.NotMatchedItem>

        </Flex>
      </div>
    </MediaQueryViewToggler>

  )
}

function DashboardLayoutContent() {
  return (
    <main className="relative w-full overflow-y-scroll tablet:h-full tablet:overflow-x-hidden tablet:overflow-y-scroll">
      <Flex className="h-full w-full px-4">
        <Outlet />
      </Flex>
    </main>
  )
}

function MobileNav() {
  return (
    <MobileDashboardFooter>
      <MobileNavbar />
    </MobileDashboardFooter>
  )
}

function DashboardLayoutLoader() {
  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  useLayoutEffect(() => {
    const rootElement = document.getElementById('root')

    if (!rootElement) {
      return
    }

    const initialHeight = rootElement.style.height

    rootElement.style.height = '100%'

    return () => {
      rootElement.style.height = initialHeight
    }
  })

  return (
    <Flex
      className="w-full h-full animate-fade-in duration-[3s]"
      justify="center"
      align="center"
    >
      <Icons.Logo
        className="animate-bounce duration-1000 text-green-accent"
        width={isLargeThenTablet ? 42 : 36}
        height={isLargeThenTablet ? 42 : 36}
      />
    </Flex>
  )
}
