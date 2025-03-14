import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { NavbarMenu } from '~widgets/navbar-menu'

import { auctionSelectors } from '~entities/auction/store'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions as storeAuctionSlotsActions } from '~entities/auction-slot/store'

import { Donation } from '~entities/donation/model'
import { donationsActions as storeDonationsActions } from '~entities/donation/store'

import { SSEApiClient } from '~shared/api/sse'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { useLocalStorage } from '~shared/hooks/use-local-storage'
import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Header } from '~shared/ui/header'
import { Icons } from '~shared/ui/icons'
import { toastPromiseNotification } from '~shared/ui/toaster/lib'

import { tailwindScreens } from '~shared/constants/tailwindcss'

const AuctionDashboardLayout = () => {
  const auctionId = useStoreSelector(auctionSelectors.getAuctionId)
  const isLargeThenTablet = useMediaQuery(
    `(min-width:${tailwindScreens.landtop})`
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

    return () => {
      SSEApiClient.getInstance()
        .auctionSlots()
        .removeListener('auction-slots/add', dispatchSlots)

      SSEApiClient.getInstance()
        .donations()
        .removeListener('donations/add', dispatchDonation)
    }
  }, [])

  return !isConnected ? (
    <div className="flex w-full h-full items-center justify-center animate-fade-in duration-[3s]">
      <Icons.Logo
        className="animate-bounce duration-1000 text-green-accent"
        width={isLargeThenTablet ? 42 : 36}
        height={isLargeThenTablet ? 42 : 36}
      />
    </div>
  ) : (
    <>
      <Header />
      <main className="main--dashboard">
        <div className="h-full w-full px-4">
          <div className="flex h-full w-full">
            {isLargeThenTablet && (
              <aside className="h-full w-13 flex-none">
                <NavbarMenu className="fixed left-3 top-1/2 -translate-y-1/2" />
              </aside>
            )}
            <Outlet />
          </div>
        </div>
      </main>
      {!isLargeThenTablet && (
        <footer className="fixed bottom-0 w-full">
          <NavbarMenu className="h-full w-full" />
        </footer>
      )}
    </>
  )
}

export default AuctionDashboardLayout
