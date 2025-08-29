import { useMemo } from 'react'

import type { IntegrationsPlatforms } from '~entities/integrations/model'

import {
  FORMATTED_INTEGRATIONS_PLATFORMS_NAMES,
  getIntegrationIcon,
} from '~shared/constants/integrations'

import type { BadgeProps } from '~shared/ui/badge'
import { Badge } from '~shared/ui/badge'
import { Flex } from '~shared/ui/flex'

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
      twitch: 'bg-gray text-white/80',
      userInput: 'bg-gray text-white/80',
    }
    return cn(integrationsStyles[integration], 'max-tablet:h-5 max-tablet:text-[10px]', className)
  }, [integration, className])

  return (
    <Badge className={styles} {...badgeProps}>
      <Flex className="gap-x-1" align="center">
        {getIntegrationIcon(
          FORMATTED_INTEGRATIONS_PLATFORMS_NAMES[integration],
          { width: 14, height: 14 },
        )}
        {FORMATTED_INTEGRATIONS_PLATFORMS_NAMES[integration]}
      </Flex>
    </Badge>
  )
}

export { IntegrationBadge }
