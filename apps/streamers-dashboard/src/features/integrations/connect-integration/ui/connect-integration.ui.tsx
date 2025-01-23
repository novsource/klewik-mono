import { memo } from 'react'

import { Card, CardContent, CardHeader } from '~shared/ui/card'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { DonatePayIntegrationButton } from './donate-pay'
import {
  DonationAlertsIntegrationButton,
  DonationAlertsRedirectDisplay,
} from './donation-alerts'

type IntegrationCardProps = {
  integrationSystem: 'DonationAlerts' | 'DonatePay'
  description?: string
}

const IntegrationCard = (props: IntegrationCardProps) => {
  const { integrationSystem, description } = props

  const integrationIcon = {
    DonationAlerts: <Icons.DonationAlerts width={24} height={28} />,
    DonatePay: <Icons.DonatePay width={32} height={32} />,
  }[integrationSystem]

  const integrationButton = {
    DonationAlerts: <DonationAlertsIntegrationButton />,
    DonatePay: <DonatePayIntegrationButton />,
  }[integrationSystem]

  return (
    <Card className="bg-[#1F1F22] max-w-[350px]">
      <CardHeader className="flex w-full justify-between items-center">
        {integrationIcon}
        {integrationButton}
      </CardHeader>
      <CardContent>
        <Typography tag="h3" className="font-golosF">
          {integrationSystem}
        </Typography>
        {description && (
          <Typography tag="p" className="text-gray-accent font-golosF">
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
