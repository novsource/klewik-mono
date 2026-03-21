import type { ReactNode } from 'react'
import { memo } from 'react'

import { INTEGRATIONS_PLATFORM_NAMES } from '~entities/integrations/constants'
import type { IntegrationsPlatforms } from '~entities/integrations/model'
import {
  BaseIntegrationCard,
  BaseIntegrationCardContent,
  BaseIntegrationCardPlatformIcon,
  BaseIntegrationCardTitle,
} from '~entities/integrations/ui/card'

import { Flex } from 'klewik-ui/flex'

import { DonatePayIntegrationButton } from './donate-pay'
import {
  DonationAlertsIntegrationButton,
  DonationAlertsRedirectDisplay,
} from './donation-alerts'
import { AuthTwitchRedirectDisplay } from './twitch/auth-twitch-redirect-display.ui'

type IntegrationCardProps = {
  platform: IntegrationsPlatforms
  description?: string
  isConnected?: boolean
}

export const IntegrationCard = (props: IntegrationCardProps) => {
  const { platform } = props

  const integrationButtons: Record<IntegrationsPlatforms, NullablePossible<ReactNode>> = {
    donationAlerts: <DonationAlertsIntegrationButton />,
    donatePay: <DonatePayIntegrationButton />,
    twitch: null,
    userInput: null,
  }

  return (
    <BaseIntegrationCard className="w-full max-w-full bg-dark">
      <BaseIntegrationCardContent className="flex-row justify-between">
        <Flex className="gap-x-2" align="center">
          <BaseIntegrationCardPlatformIcon platform={platform} />
          <BaseIntegrationCardTitle className="text-[14px]">{ INTEGRATIONS_PLATFORM_NAMES[platform] }</BaseIntegrationCardTitle>
        </Flex>
        {integrationButtons[platform]}
      </BaseIntegrationCardContent>
    </BaseIntegrationCard>
  )
}

type RedirectDisplayProps = {
  platform: IntegrationsPlatforms
}

export const RedirectDisplay = memo((props: RedirectDisplayProps) => {
  const redirectDisplay = {
    donationAlerts: <DonationAlertsRedirectDisplay />,
    donatePay: <></>,
    twitch: <AuthTwitchRedirectDisplay />,
    userInput: <></>,
  }[props.platform]

  return redirectDisplay
})
