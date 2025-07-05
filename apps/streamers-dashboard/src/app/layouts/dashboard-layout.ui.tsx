import { useEffect, useState } from 'react'

import { Outlet } from 'react-router-dom'

import { DashboardHeader } from '~widgets/dashboard-header/ui'
import { DesktopNavbarMenu } from '~widgets/navbar-menu/desktop-navbar-menu/ui'
import { MobileNavbarMenu } from '~widgets/navbar-menu/mobile-navbar-menu/ui'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions as storeAuctionSlotsActions } from '~entities/auction-slot/store'
import { auctionSelectors } from '~entities/auction/store'
import type { ProcessedDonation } from '~entities/donation/model'
import { donationsActions as storeDonationsActions } from '~entities/donation/store'

import { SSEClientsManager } from '~shared/api/sse/clients-manager'
import { tailwindScreens } from '~shared/constants/tailwindcss'
import { useLocalStorage } from '~shared/hooks/use-local-storage'
import { useMediaQuery } from '~shared/hooks/use-media-query'
import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { toastPromiseNotification } from '~shared/ui/toaster/lib'

const DashboardLayout = () => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const isLargeThenTablet = useMediaQuery(
    `(min-width:${tailwindScreens.tablet})`,
  )

  const auctionSlotsActions = useActionCreators(storeAuctionSlotsActions)
  const donationActions = useActionCreators(storeDonationsActions)

  const [isConnected, setIsConnected] = useState(false)

  const slotsLastMessageId = useLocalStorage('slots:last-message-id')
  const donationsLastMessageId = useLocalStorage('donations:last-message-id')

  useEffect(() => {
    if (slotsLastMessageId.value === undefined) {
      slotsLastMessageId.set(0)
    }

    if (donationsLastMessageId.value === undefined) {
      donationsLastMessageId.set(0)
    }
  })

  useEffect(() => {
    if (!isConnected) {
      const connectSSERequest = SSEClientsManager.init(
        auctionUUID,
      ).connectToAllEvents({
        slotsLastMessageId: slotsLastMessageId.value,
        donationsLastMessageId: donationsLastMessageId.value,
      })

      toastPromiseNotification(connectSSERequest, 'Подключение к серверу...', {
        successText: 'Подключение к серверу',
        errorText: 'Ошибка подключения к серверу',
        onSuccess: () => {
          setIsConnected(true)
        },
      })
    }
  }, [auctionUUID, isConnected, slotsLastMessageId.value, donationsLastMessageId.value])

  useEffect(() => {
    const dispatchSlots = (slots: AuctionSlot[]) =>
      auctionSlotsActions.addSlots(slots)
    const dispatchDonation = (donation: ProcessedDonation) =>
      donationActions.addDonation(donation)

    SSEClientsManager.getInstance().auctionSlots.onSSEEvent(
      'onmessage',
      ({ id }) => {
        slotsLastMessageId.set(Number(id))
      },
    )

    SSEClientsManager.getInstance().donations.onSSEEvent(
      'onmessage',
      ({ id }) => {
        slotsLastMessageId.set(Number(id))
      },
    )

    SSEClientsManager.getInstance().auctionSlots.onEvent(
      'auction-slots/add',
      dispatchSlots,
    )
    SSEClientsManager.getInstance().donations.onEvent(
      'donations/add',
      dispatchDonation,
    )
  }, [auctionSlotsActions, donationActions, slotsLastMessageId])

  if (!isConnected) {
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

export { DashboardLayout }
