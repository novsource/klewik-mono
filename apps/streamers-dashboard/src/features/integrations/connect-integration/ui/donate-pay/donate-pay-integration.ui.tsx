import { memo } from 'react'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

import { IntegrationCard } from '../connect-integration.ui'

export const DonatePayIntegrationCard = memo(() => {
  return (
    <IntegrationCard
      platform="donatePay"
      description="Использование пожертвований для создания слотов"
    />
  )
})

export const DonatePayIntegrationButton = () => {
  return (
    <Button
      className="bg-gray/40 font-medium text-gray-accent"
      size="xs"
      startContent={<Icons.Programming size="sm" />}
      disabled
    >
      В разработке
    </Button>
  )
}
