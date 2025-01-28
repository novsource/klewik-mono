import { memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
        <Typography tag="h3" className="font-golos-f">
          {integrationSystem}
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
  const [isCheckOrigin, setIsCheckOrigin] = useState(false)

  const redirectDisplay = {
    donalerts: <DonationAlertsRedirectDisplay />,
    donatepay: <></>,
  }[props.provider]

  const navigate = useNavigate()

  useEffect(() => {
    if (`${window.location.origin}/` !== document.referrer.toString()) {
      navigate('/')
    }

    setIsCheckOrigin(true)
  }, [])

  return isCheckOrigin && redirectDisplay
})

export { IntegrationCard, RedirectDisplay }
