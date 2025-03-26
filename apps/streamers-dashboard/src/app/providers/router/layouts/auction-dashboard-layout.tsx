import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { DashboardHeader } from '~widgets/dashboard-header/ui'
import { DesktopNavbarMenu } from '~widgets/navbar-menu/desktop-navbar-menu/ui'
import { MobileNavbarMenu } from '~widgets/navbar-menu/mobile-navbar-menu/ui'

import { auctionSelectors } from '~entities/auction/store'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions as storeAuctionSlotsActions } from '~entities/auction-slot/store'

import { Donation } from '~entities/donation/model'
import { donationsActions as storeDonationsActions } from '~entities/donation/store'

import { SSEApiClient } from '~shared/api/sse/clients-manager/sse-clients-manager'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { useLocalStorage } from '~shared/hooks/use-local-storage'
import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { toastPromiseNotification } from '~shared/ui/toaster/lib'

import { tailwindScreens } from '~shared/constants/tailwindcss'

const AuctionDashboardLayout = () => {
  const auctionId = useStoreSelector(auctionSelectors.getAuctionId)
  const isLargeThenTablet = useMediaQuery(
    `(min-width:${tailwindScreens.tablet})`
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
  }, [])

  useEffect(() => {
    const connectSSERequest = SSEApiClient.init(auctionId).connectToAllEvents({
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
  }, [])

  useEffect(() => {
    const dispatchSlots = (slots: AuctionSlot[]) =>
      auctionSlotsActions.addSlots(slots)
    const dispatchDonation = (donation: Donation) =>
      donationActions.addDonation(donation)

    SSEApiClient.getInstance()
      .auctionSlots()
      .on('onmessage', ({ id }) => {
        slotsLastMessageId.set(Number(id))
      })

    SSEApiClient.getInstance()
      .donations()
      .on('onmessage', ({ id }) => {
        slotsLastMessageId.set(Number(id))
      })

    SSEApiClient.getInstance().auctionSlots().onAddingSlots(dispatchSlots)
    SSEApiClient.getInstance().donations().onNewDonation(dispatchDonation)
  }, [])

  return !isConnected ? (
    <Flex
      className="w-full h-full animate-fade-in duration-[3s]"
      justify={'center'}
      align={'center'}
    >
      <Icons.Logo
        className="animate-bounce duration-1000 text-green-accent"
        width={isLargeThenTablet ? 42 : 36}
        height={isLargeThenTablet ? 42 : 36}
      />
    </Flex>
  ) : (
    <>
      <DashboardHeader>
        {!isLargeThenTablet && <MobileNavbarMenu />}
      </DashboardHeader>
      <main className="main--dashboard">
        <Flex className="h-full w-full px-4">
          {isLargeThenTablet && <DesktopNavbarMenu />}
          <Outlet />
        </Flex>
      </main>
    </>
  )
}

export default AuctionDashboardLayout
