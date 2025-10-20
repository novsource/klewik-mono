import { memo, useCallback, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { sha256 } from 'js-sha256'

import { auctionSelectors } from '~entities/auction/store'

import { integrationsSelectors } from '~entities/integrations/store'

import { refreshTokens } from '~shared/api/http/auth/auth.api'

import { DONATION_ALERTS_ENDPOINTS } from '~shared/constants/integrations'

import { useLocalStorage } from '~shared/hooks/use-local-storage'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

import { useLazyConnectSSEDonationAlertsQuery } from '../../api/donation-alerts'
import { IntegrationCard } from '../connect-integration.ui'

export const DonationAlertsRedirectDisplay = memo(() => {
  const navigate = useNavigate()

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const [connectSSEDonationAlerts, { isSuccess }]
    = useLazyConnectSSEDonationAlertsQuery()

  const { set } = useLocalStorage('donationAlerts')
  const { value, remove } = useLocalStorage('redirect:donalerts')

  useEffect(() => {
    if (value === undefined || !value[auctionUUID]) {
      return navigate(`/dashboard/${auctionUUID}/wheel`)
    }

    const time = value[auctionUUID].time
    const redirectKey = value[auctionUUID].key

    const key = sha256.hmac(
      import.meta.env.VITE_REDIRECT_KEY,
      import.meta.env.VITE_REDIRECT_SECRET + time,
    )

    if (redirectKey !== key) {
      remove()
      return navigate(`/dashboard/${auctionUUID}/wheel`)
    }
  }, [auctionUUID, value])

  useEffect(() => {
    const connect = async () => {
      const response = await connectSSEDonationAlerts({ auctionUUID })

      if (response.isSuccess) {
        remove()
        set({ [auctionUUID]: response.data })

        setTimeout(() => {
          navigate(`/dashboard/${auctionUUID}/wheel`)
        }, 5000)
      }
    }
    connect()
  }, [connectSSEDonationAlerts, auctionUUID])

  return (
    <Flex
      className="relative w-full h-full gap-x-16 tablet:gap-x-36 pb-8"
      align="center"
    >
      <Icons.Logo className="text-green-accent" width={54} height={54} />
      <Icons.DonationAlerts width={54} height={54} />
      <div className="absolute w-full h-4 bottom-2 px-7">
        <div className="relative w-full h-full">
          <div
            className={cn(
              'w-full h-full rounded-b-lg border-l-4 border-r-4 border-b-4 transition-colors',
              !isSuccess && 'animate-pulse border-gray/80 duration-[3s]',
              isSuccess && 'border-green-accent/80 duration-1000',
            )}
          >
          </div>
          <Typography
            tag="span"
            className={cn(
              'absolute -translate-x-1/2 left-1/2 top-6 text-md text-nowrap text-gray-accent font-medium',
              isSuccess
              && 'text-green-accent/80 animate-fadeIn duration-[3s] font-medium',
            )}
          >
            {isSuccess
              ? 'DonationAlerts успешно подключен!'
              : 'Подключаем Donation Alerts... Пожалуйста подождите'}
          </Typography>
        </div>
      </div>
    </Flex>
  )
})

export const DonationAlertsIntegrationButton = () => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const { isConnected } = useStoreSelector(
    integrationsSelectors.getDonationAlertsStatus,
  )

  const [isPressed, setIsPressed] = useState(false)

  const { set } = useLocalStorage('redirect:donalerts')

  const openDonationAlertAuth = useCallback(async () => {
    // Refresh tokens cause when we redirect can be auth error
    await refreshTokens()

    const donalertsUrlParams = new URLSearchParams({
      client_id: import.meta.env.VITE_DONALERTS_APP_ID,
      redirect_url: `${import.meta.env.VITE_SERVER_URL}/api/integrations/donalerts/callback`,
      response_type: 'code',
      scope: import.meta.env.VITE_DONALERTS_SCOPES,
    })

    const url = new URL(DONATION_ALERTS_ENDPOINTS.AUTHORIZE_URL)

    url.search = donalertsUrlParams.toString()

    setIsPressed(true)

    if (!isConnected) {
      set({
        [auctionUUID]: {
          time: Date.now(),
          key: sha256.hmac(
            import.meta.env.VITE_REDIRECT_KEY,
            import.meta.env.VITE_REDIRECT_SECRET + Date.now().toString(),
          ),
        },
      })
      window.open(url, '_self')
    }
  }, [isConnected])

  return (
    <Button
      className={cn(
        !isConnected && 'border-1 border-dark-accent transition-all',
        isConnected
        && 'bg-green/20 border-0 text-green cursor-default hover:bg-green/20 hover:text-green',
      )}
      size="xs"
      startContent={
        isConnected && <Icons.Success size="sm" className="text-green" />
      }
      disabled={isPressed}
      onClick={openDonationAlertAuth}
    >
      {!isConnected && (isPressed ? 'Подождите...' : 'Подключить')}
      {isConnected && 'Подключено'}
    </Button>
  )
}

export const DonationAlertsIntegrationCard = memo(() => {
  const { isConnected } = useStoreSelector(integrationsSelectors.getDonationAlertsStatus)

  return (
    <IntegrationCard
      platform="donationAlerts"
      description="Использование пожертвований для создания слотов"
      isConnected={isConnected}
    />
  )
})
