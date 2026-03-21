import type { DonationAlertsRedirectParams } from '../../model/connect-integration.types'

import { memo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { auctionSelectors } from '~entities/auction/store'

import { integrationsSelectors } from '~entities/integrations/store'

import { Text } from '~shared/components/typography'

import { useUrlSearchParams } from '~shared/hooks'
import { useLocalStorage } from '~shared/hooks/use-local-storage'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { toastErrorNotification } from 'klewik-ui/toaster/lib'

import { cn } from '~shared/utils'

import { DONATION_ALERTS_REDIRECT_LOCAL_STORAGE_KEY } from '../../constants/donation-alerts-local-storage'
import { useAuthDonationAlerts, useConnectDonationAlertsSSE } from '../../hooks/use-connect-donation-alerts'
import { IntegrationCard } from '../connect-integration.ui'

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

export const DonationAlertsRedirectDisplay = memo(() => {
  const integrationParams = useUrlSearchParams<DonationAlertsRedirectParams>()

  const navigate = useNavigate()

  const donationAlertsRedirectLocalStorage = useLocalStorage(DONATION_ALERTS_REDIRECT_LOCAL_STORAGE_KEY)

  const { state, actions: { connectSSE } } = useConnectDonationAlertsSSE({
    onSuccess: () => {
      donationAlertsRedirectLocalStorage.remove()

      navigate(`/dashboard/${integrationParams.value?.auction}/wheel`)
    },
    onError: () => {
      toastErrorNotification('Не удалось подключить Donation Alerts к аукциону')

      if (!integrationParams?.value || integrationParams.value.error) {
        navigate('/error')

        return
      }

      navigate(`/dashboard/${integrationParams.value!.auction}/wheel`)
    },
  })

  if (integrationParams.value && integrationParams.value.auth && state.isUninitialized) {
    connectSSE(integrationParams.value.auction)
  }

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
              !state.isSuccess && 'animate-pulse border-gray-light/60 duration-[3s]',
              state.isSuccess && 'border-green-accent/80 duration-1000',
            )}
          >
          </div>
          <Text
            className={cn(
              'absolute -translate-x-1/2 left-1/2 top-6 text-md text-nowrap text-gray-accent font-medium',
              state.isSuccess
              && 'text-green-accent/80 animate-fadeIn duration-[3s] font-medium',
            )}
            asSpan
          >
            {state.isSuccess
              ? 'DonationAlerts успешно подключен!'
              : 'Подключаем Donation Alerts... Пожалуйста подождите'}
          </Text>
        </div>
      </div>
    </Flex>

  )
})

export const DonationAlertsIntegrationButton = () => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const [isPressed, setIsPressed] = useState(false)

  const {
    state: { isValid: isAuth },
    actions: { openDonationAlertAuthWindow, attachDonationsToSSE },
  } = useAuthDonationAlerts()

  return (
    <Button
      className={cn(
        !isAuth && 'border-1 border-dark-accent transition-all',
        isAuth
        && 'bg-green/20 border-0 text-green cursor-default hover:bg-green/20 hover:text-green',
      )}
      size="xs"
      startContent={
        isAuth && <Icons.Success size="sm" className="text-green" />
      }
      disabled={isPressed}
      onClick={() => {
        setIsPressed(true)

        if (!isAuth) {
          openDonationAlertAuthWindow()
        }
        else {
          attachDonationsToSSE(auctionUUID)
        }
      }}
    >
      {!isAuth && (isPressed ? 'Подождите...' : 'Подключить')}
      {isAuth && 'Подключено'}
    </Button>
  )
}
