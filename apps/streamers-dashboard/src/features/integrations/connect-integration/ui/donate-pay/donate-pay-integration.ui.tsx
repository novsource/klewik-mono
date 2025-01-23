import { memo } from 'react'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

import { IntegrationCard } from '../connect-integration.ui'

const DonatePayRedirectDisplay = memo(() => {})

const DonatePayIntegrationCard = memo(() => {
  return (
    <IntegrationCard
      integrationSystem="DonatePay"
      description="Использование пожертвований для создания слотов"
    />
  )
})

const DonatePayIntegrationButton = () => {
  return (
    <Button
      className="bg-gray/40 font-medium text-gray-accent"
      size="sm"
      startContent={<Icons.Programming size="sm" />}
      disabled
    >
      В разработке
    </Button>
  )
}

export { DonatePayIntegrationCard, DonatePayIntegrationButton }
