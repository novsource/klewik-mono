import { memo, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { sha256 } from 'js-sha256'
import { integrationsSelectors } from '~entities/integrations/store'

import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useLocalStorage } from '~shared/hooks/use-local-storage'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { DONATION_ALERTS_ENDPOINTS } from '~shared/constants/integrations'

import { cn } from '~shared/utils'

import { useLazyConnectSSEDonationAlertsQuery } from '../../api/donation-alerts'
import { IntegrationCard } from '../connect-integration.ui'

const DonationAlertsRedirectDisplay = memo(() => {
  const auctionId = useStoreSelector(auctionSelectors.getAuctionId)

  const [connectSSEDonationAlerts, { isSuccess }] =
    useLazyConnectSSEDonationAlertsQuery()

  const [connectionText, setConnectionText] = useState(
    'Подключаем Donation Alerts... Пожалуйста подождите'
  )

  const navigate = useNavigate()

  const { set } = useLocalStorage('donationAlerts')
  const { value, remove } = useLocalStorage('redirect:donalerts')

  useEffect(() => {
    if (value === undefined || !value[auctionId!]) {
      return navigate(`/dashboard/${auctionId}/settings`)
    }

    const time = value[auctionId!].time
    const redirectKey = value[auctionId!].key

    const key = sha256.hmac(
      import.meta.env.VITE_REDIRECT_KEY,
      import.meta.env.VITE_REDIRECT_SECRET + time
    )

    if (redirectKey !== key) {
      remove()
      return navigate(`/dashboard/${auctionId}/settings`)
    }
  }, [])

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate(`/dashboard/${auctionId}/settings`)
      }, 5000)
    }
  }, [isSuccess])

  useEffect(() => {
    const connect = async () => {
      const response = await connectSSEDonationAlerts({ auctionId })

      if (response.isSuccess) {
        remove()
        set({ [auctionId]: response.data })

        setConnectionText('DonationAlerts успешно подключен!')
      }
    }

    connect()
  }, [auctionId])

  return (
    <div className="relative flex w-full h-full gap-x-16 tablet:gap-x-36 items-center pb-8">
      <Icons.Logo className="text-green-accent" width={54} height={54} />
      <Icons.DonationAlerts width={54} height={54} />
      <div className="absolute w-full h-4 bottom-2 px-7">
        <div className="relative w-full h-full">
          <div
            className={cn(
              'w-full h-full rounded-b-lg border-l-4 border-r-4 border-b-4 transition-colors',
              !isSuccess && 'animate-pulse border-gray/80 duration-[3s]',
              isSuccess && 'border-green-accent/80 duration-1000'
            )}
          ></div>
          <Typography
            tag="span"
            className={cn(
              'absolute -translate-x-1/2 left-1/2 top-6 text-md text-nowrap text-gray-accent font-medium',
              isSuccess &&
                'text-green-accent/80 animate-fadeIn duration-[3s] font-medium'
            )}
          >
            {connectionText}
          </Typography>
        </div>
      </div>
    </div>
  )
})

const DonationAlertsIntegrationButton = () => {
  const auctionId = useStoreSelector(auctionSelectors.getAuctionId)
  const { isConnected } = useStoreSelector(
    integrationsSelectors.getDonationAlertsStatus
  )
  const [isPressed, setIsPressed] = useState(false)

  const { set } = useLocalStorage('redirect:donalerts')

  const openDonationAlertAuth = useCallback(() => {
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
        [auctionId]: {
          time: Date.now(),
          key: sha256.hmac(
            import.meta.env.VITE_REDIRECT_KEY,
            import.meta.env.VITE_REDIRECT_SECRET + Date.now().toString()
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
        isConnected &&
          'bg-green/20 border-0 text-green/100 cursor-default hover:bg-green/20'
      )}
      size="sm"
      startContent={
        isConnected && <Icons.Success size="sm" className="text-green" />
      }
      onClick={openDonationAlertAuth}
    >
      {!isConnected && (isPressed ? 'Подождите...' : 'Подключить')}
      {isConnected && 'Подключено'}
    </Button>
  )
}

const DonationAlertsIntegrationCard = memo(() => {
  return (
    <IntegrationCard
      integrationSystem="donation-alerts"
      description="Использование пожертвований для создания слотов"
    />
  )
})

export {
  DonationAlertsIntegrationCard,
  DonationAlertsIntegrationButton,
  DonationAlertsRedirectDisplay,
}
