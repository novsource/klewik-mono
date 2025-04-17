import { useMemo } from 'react'

import { IntegrationsPlatforms } from '~entities/integrations/model'

import { Badge, BadgeProps } from '~shared/ui/badge'
import { Flex } from '~shared/ui/flex'

import {
  FORMATTED_INTEGRATIONS_PLATFORMS_NAMES,
  getIntegrationIcon,
} from '~shared/constants/integrations'

import { cn } from '~shared/utils'

type IntegrationsBadgeProps = Omit<BadgeProps, 'children'> & {
  integration: IntegrationsPlatforms
}

const IntegrationBadge = (props: IntegrationsBadgeProps) => {
  const { integration, className, ...badgeProps } = props

  const styles = useMemo(() => {
    const integrationsStyles: Record<IntegrationsPlatforms, string> = {
      donatePay: 'bg-green-accent/20 text-white/80',
      donationAlerts: 'bg-orange/20 text-orange',
    }
    return cn(integrationsStyles[integration], className)
  }, [integration, className])

  return (
    <Badge className={styles} {...badgeProps}>
      <Flex className="gap-x-1" align="center">
        {getIntegrationIcon(
          FORMATTED_INTEGRATIONS_PLATFORMS_NAMES[integration],
          { width: 14, height: 14 }
        )}
        {FORMATTED_INTEGRATIONS_PLATFORMS_NAMES[integration]}
      </Flex>
    </Badge>
  )
}

export { IntegrationBadge }
