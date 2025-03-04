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
    'donation-alerts': <Icons.DonationAlerts width={24} height={28} />,
    'donate-pay': <Icons.DonatePay width={32} height={32} />,
  }[integrationSystem]

  const integrationButton = {
    'donation-alerts': <DonationAlertsIntegrationButton />,
    'donate-pay': <DonatePayIntegrationButton />,
  }[integrationSystem]

  const integrationPlatformName = {
    'donation-alerts': 'Donation Alerts',
    'donate-pay': 'Donate Pay',
  }[integrationSystem]

  return (
    <Card className="bg-dark max-w-[350px]">
      <CardHeader className="flex w-full justify-between items-center">
        {integrationIcon}
        {integrationButton}
      </CardHeader>
      <CardContent>
        <Typography tag="h3" className="font-golos-f">
          {integrationPlatformName}
        </Typography>
        {description && (
          <Typography tag="p" className="text-gray-accent font-golos-f">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

type RedirectDisplayProps = {
  provider: 'donalerts' | 'donatepay'
}

const RedirectDisplay = memo((props: RedirectDisplayProps) => {
  const redirectDisplay = {
    donalerts: <DonationAlertsRedirectDisplay />,
    donatepay: <></>,
  }[props.provider]

  return redirectDisplay
})

export { IntegrationCard, RedirectDisplay }
