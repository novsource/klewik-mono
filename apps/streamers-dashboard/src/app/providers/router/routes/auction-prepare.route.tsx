import { useCallback, useEffect, useState } from 'react'
import { Outlet, RouteObject, useParams } from 'react-router-dom'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions } from '~entities/auction-slot/store'
import { Donation } from '~entities/donation/model'
import { donationsActions } from '~entities/donation/store'

import { AuctionSlotsSSEClient } from '~shared/api/sse/auction-slots'
import { DonationsSSEClient } from '~shared/api/sse/donations'

import { appActions, appSelectors } from '~shared/store/slices'

import { useStoreDispatch, useStoreSelector } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Icons } from '~shared/ui/icons'

import { tailwindScreens } from '~shared/constants/tailwindcss'

const AuctionPrepare = () => {
  const auctionId = useStoreSelector(appSelectors.getAuctionId)
  const dispatch = useStoreDispatch()

  const params = useParams()

  const [isConnected, setIsConnected] = useState(false)

  const isLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet}px)`
  )

  const connectToSSE = useCallback(async () => {
    if (!auctionId) return

    AuctionSlotsSSEClient.getInstance().onChannelLeadership(() => {
      AuctionSlotsSSEClient.getInstance().connectToServer(auctionId)
    })

    DonationsSSEClient.getInstance().onChannelLeadership(() => {
      DonationsSSEClient.getInstance().connectToServer(auctionId)
    })
  }, [auctionId])

  useEffect(() => {
    connectToSSE()
    setIsConnected(true)
  }, [connectToSSE])

  useEffect(() => {
    const dispatchSlots = (slots: AuctionSlot[]) =>
      dispatch(auctionSlotsActions.addSlots(slots))
    const dispatchDonation = (donation: Donation) =>
      dispatch(donationsActions.addDonation(donation))

    AuctionSlotsSSEClient.getInstance().onAddingSlots(dispatchSlots)
    DonationsSSEClient.getInstance().onNewDonation(dispatchDonation)

    return () => {
      AuctionSlotsSSEClient.getInstance().removeListener(
        'auction-slots/add',
        dispatchSlots
      )
      DonationsSSEClient.getInstance().removeListener(
        'donations/add',
        dispatchDonation
      )
    }
  }, [])

  useEffect(() => {
    dispatch(appActions.setAuctionId(params['auctionId']!))
  }, [params])

  return !isConnected ? (
    <div className="flex w-full h-full items-center justify-center animate-fadeIn">
      <Icons.Logo
        className="animate-bounce duration-700 text-green-accent"
        width={isLargeThenTablet ? 64 : 42}
        height={isLargeThenTablet ? 64 : 42}
      />
    </div>
  ) : (
    <Outlet />
  )
}

const auctionPrepareRoute = (childrens: RouteObject[]): RouteObject => {
  return { element: <AuctionPrepare />, children: childrens }
}

export { auctionPrepareRoute }
