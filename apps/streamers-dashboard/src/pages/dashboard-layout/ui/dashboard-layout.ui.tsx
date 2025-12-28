import { Outlet, useLoaderData } from 'react-router-dom'

import { MobileDashboardFooter } from '~widgets/dashboard-footer/ui'
import { DashboardHeader } from '~widgets/dashboard-header/ui'
import { DesktopNavbar, MobileNavbar } from '~widgets/dashboard-navbar/ui'

import type { Auction } from '~entities/auction/model'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { useDashboardLayout } from '../hooks/use-dashboard-layout'

export const DashboardLayout = () => {
  const { auctionUUID } = useLoaderData() as Auction

  const { isSSEConnected } = useDashboardLayout(auctionUUID)

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  if (!isSSEConnected) {
    return <DashboardLayoutLoader />
  }

  return (
    <div className="w-full h-full tablet:inline-flex tablet:h-auto">
      {isLargeThenTablet && (
        <aside className="sticky top-0 h-screen py-4 border-r-1 border-r-dark bg-dark-foreground-light">
          <DesktopNavbar />
        </aside>
      ) }
      <Flex className="w-full h-full flex flex-col">
        <DashboardHeader />
        <DashboardMainContent />
        {!isLargeThenTablet && <MobileNav />}
      </Flex>
    </div>
  )
}

function DashboardMainContent() {
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
