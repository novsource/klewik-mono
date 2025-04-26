import { memo } from 'react'

import { IntegrationsPlatforms } from '~entities/integrations/model'

import { Card, CardContent, CardHeader } from '~shared/ui/card'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { DonatePayIntegrationButton } from './donate-pay'
import {
  DonationAlertsIntegrationButton,
  DonationAlertsRedirectDisplay,
} from './donation-alerts'

type IntegrationCardProps = {
  integrationSystem: IntegrationsPlatforms
  description?: string
}

const IntegrationCard = (props: IntegrationCardProps) => {
  const { integrationSystem, description } = props

  const integrationIcon = {
    donationAlerts: <Icons.DonationAlerts width={24} height={28} />,
    donatePay: <Icons.DonatePay width={32} height={32} />,
  }[integrationSystem]

  const integrationButton = {
    donationAlerts: <DonationAlertsIntegrationButton />,
    donatePay: <DonatePayIntegrationButton />,
  }[integrationSystem]

  const integrationPlatformName = {
    donationAlerts: 'Donation Alerts',
    donatePay: 'Donate Pay',
  }[integrationSystem]

  return (
    <Card className="bg-dark max-w-[350px]">
      <CardHeader className="flex w-full justify-between items-center">
        {integrationIcon}
        {integrationButton}
      </CardHeader>
      <CardContent>
        <Typography tag="span" className="text-title font-bold">
          {integrationPlatformName}
        </Typography>
        {description && (
          <Typography tag="p" className="text-gray-accent">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
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
