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

import { DonatePayIntegrationButton } from './donate-pay'
import {
  DonationAlertsIntegrationButton,
  DonationAlertsRedirectDisplay,
} from './donation-alerts'

type IntegrationCardProps = {
  platform: IntegrationsPlatforms
  description?: string
}

const IntegrationCard = (props: IntegrationCardProps) => {
  const { platform, description } = props

  const integrationButtons: Record<IntegrationsPlatforms, NullablePossible<ReactNode>> = {
    donationAlerts: <DonationAlertsIntegrationButton />,
    donatePay: <DonatePayIntegrationButton />,
    twitch: null,
    userInput: null,
  }

  return (
    <BaseIntegrationCard>
      <BaseIntegrationCardHeader className="h-12">
        <BaseIntegrationCardPlatformIcon platform={platform} />
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
  provider: IntegrationsPlatforms
}

const RedirectDisplay = memo((props: RedirectDisplayProps) => {
  const redirectDisplay = {
    donationAlerts: <DonationAlertsRedirectDisplay />,
    donatePay: <></>,
  }[props.provider]

  return redirectDisplay
})

export { IntegrationCard, RedirectDisplay }
