import type { ReactNode } from 'react'
import { memo } from 'react'

import { INTEGRATIONS_PLATFORM_NAMES } from '~entities/integrations/constants'
import type { IntegrationsPlatforms } from '~entities/integrations/model'
import {
  BaseIntegrationCard,
  BaseIntegrationCardContent,
  BaseIntegrationCardDescription,
  BaseIntegrationCardFooter,
  BaseIntegrationCardHeader,
  BaseIntegrationCardPlatformIcon,
  BaseIntegrationCardTitle,
} from '~entities/integrations/ui/card'

import { Icons } from '~shared/ui/icons'

import { DonatePayIntegrationButton } from './donate-pay'
import {
  DonationAlertsIntegrationButton,
  DonationAlertsRedirectDisplay,
} from './donation-alerts'

type IntegrationCardProps = {
  platform: IntegrationsPlatforms
  description?: string
  isConnected?: boolean
}

export const IntegrationCard = (props: IntegrationCardProps) => {
  const { platform, description, isConnected = false } = props

  const integrationButtons: Record<IntegrationsPlatforms, NullablePossible<ReactNode>> = {
    donationAlerts: <DonationAlertsIntegrationButton />,
    donatePay: <DonatePayIntegrationButton />,
    twitch: null,
    custom: null,
  }

  return (
    <BaseIntegrationCard>
      <BaseIntegrationCardHeader className="h-12 flex flex-row justify-between">
        <BaseIntegrationCardPlatformIcon platform={platform} />
        {isConnected
          && (
            <div className="rounded-small bg-green-dark p-1">
              <Icons.Success className="text-green-accent" size="sm" />
            </div>
          )}
      </BaseIntegrationCardHeader>
      <BaseIntegrationCardContent>
        <BaseIntegrationCardTitle>{ INTEGRATIONS_PLATFORM_NAMES[platform] }</BaseIntegrationCardTitle>
        <BaseIntegrationCardDescription>{ description }</BaseIntegrationCardDescription>
      </BaseIntegrationCardContent>
      <BaseIntegrationCardFooter className="justify-end pt-2.5 pb-2">
        {integrationButtons[platform]}
      </BaseIntegrationCardFooter>
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
    twitch: <></>,
    custom: <></>,
  }[props.platform]

  return redirectDisplay
})
