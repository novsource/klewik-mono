import { useEffect, useRef, useState } from 'react'

import { Outlet } from 'react-router-dom'

import { DashboardHeader } from '~widgets/dashboard-header/ui'
import { DesktopNavbarMenu, MobileNavbarMenu } from '~widgets/navbar-menu/ui'

import { auctionSelectors } from '~entities/auction/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useAppSSE, useDidUpdate, useMediaQuery, useUnmount } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { sseActions } from '~shared/store/slices'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

export const DashboardLayout = () => {
  const [isSSEStateReseted, setIsSSEStateReseted] = useState(false)

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const { setAllConnected, resetState } = useActionCreators(sseActions)

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  const { isAllConnected, connectToAllEvents, isPending, isTabLeader } = useAppSSE()

  const isTabLeaderRef = useRef(isTabLeader)

  useDidUpdate(() => {
    const isBecomeLeader = !isTabLeaderRef.current && isTabLeader

    if (isBecomeLeader && !isSSEStateReseted) {
      resetState()
      setIsSSEStateReseted(true)
    }

    if (isBecomeLeader && !isPending && isSSEStateReseted) {
      isTabLeaderRef.current = true

      connectToAllEvents(auctionUUID).then(() => {
        setAllConnected(true)
      })
    }
  }, [isPending, isAllConnected, auctionUUID, isTabLeader])

  useEffect(() => {
    if (isAllConnected || isPending || !isTabLeader)
      return

    connectToAllEvents(auctionUUID).then(() => {
      setAllConnected(true)
    })
  }, [isPending, isAllConnected, auctionUUID, isTabLeader])

  useUnmount(() => {
    setAllConnected(false)
  })

  if (!isAllConnected) {
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

  return (
    <div className="w-full h-full grid max-tablet:grid-rows-dashboard-mobile grid-rows-dashboard-desktop">
      <DashboardHeader />
      <main className="main--dashboard">
        <Flex className="h-full w-full px-4">
          {isLargeThenTablet && <DesktopNavbarMenu />}
          <Outlet />
        </Flex>
      </main>
      {!isLargeThenTablet && <MobileNavbarMenu />}
    </div>

  )
}
