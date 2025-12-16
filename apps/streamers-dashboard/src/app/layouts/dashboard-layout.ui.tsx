import { useCallback, useEffect, useRef, useState } from 'react'

import { Outlet, useLoaderData, useLocation } from 'react-router-dom'

import { MobileDashboardFooter } from '~widgets/dashboard-footer/ui'
import { DashboardHeader } from '~widgets/dashboard-header/ui'
import { DesktopNavbar, MobileNavbar } from '~widgets/dashboard-navbar/ui'

import type { Auction } from '~entities/auction/model'

import { donationsActions } from '~entities/donation/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useAppSSE, useDidUpdate, useMediaQuery, useUnmount } from '~shared/hooks'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { sseActions } from '~shared/store/slices'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

export const DashboardLayout = () => {
  const { pathname } = useLocation()
  const { auctionUUID } = useLoaderData() as Auction

  const [isSSEStateReseted, setIsSSEStateReseted] = useState(false)

  const { setAllConnected, resetState } = useActionCreators(sseActions)
  const { addDonation, updateDonationsStatusesCounts } = useActionCreators(donationsActions)

  const { isAllConnected, connectToSSEEvents, isPending, isTabLeader } = useAppSSE({
    donations: {
      'donations/add': (donation) => {
        try {
          addDonation(donation)
          updateDonationsStatusesCounts({ [donation.processData.status]: 1 })
        }
        catch {}
      },
    },
  })

  const isTabLeaderRef = useRef(isTabLeader)

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  const connectToSSE = useCallback(async (auctionUUID: string) => {
    await connectToSSEEvents(auctionUUID)
    setAllConnected(true)
  }, [])

  useDidUpdate(() => {
    const isBecomeLeader = !isTabLeaderRef.current && isTabLeader

    if (isBecomeLeader && !isSSEStateReseted) {
      resetState()
      setIsSSEStateReseted(true)
    }

    if (isBecomeLeader && !isPending && isSSEStateReseted) {
      isTabLeaderRef.current = true

      connectToSSE(auctionUUID)
    }
  }, [isPending, isAllConnected, auctionUUID, isTabLeader])

  useEffect(() => {
    if (isAllConnected || isPending || !isTabLeader)
      return

    connectToSSE(auctionUUID)
  }, [isPending, isAllConnected, auctionUUID, isTabLeader])

  useUnmount(() => {
    setAllConnected(false)
  })

  if (!isAllConnected) {
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
