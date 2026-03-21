import type { FORMATTED_INTEGRATIONS_PLATFORMS_NAMES } from './integrations-names.constants'

import type { ReactNode, SVGProps } from 'react'

import { Icons } from 'klewik-ui/icons'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: 'xs' | 'sm' | 'default' | 'lg'
}

const getIntegrationIcon = (
  integrationName: FORMATTED_INTEGRATIONS_PLATFORMS_NAMES,
  iconProps?: IconProps,
) => {
  const integrationsIcons: Record<
    FORMATTED_INTEGRATIONS_PLATFORMS_NAMES,
    ReactNode
  > = {
    'DonationAlerts': <Icons.DonationAlerts {...iconProps} />,
    'Donate Pay': <Icons.DonatePay {...iconProps} />,
    'Custom': <></>,
    'Twitch': <Icons.TwitchLogo {...iconProps} />,
  }

  return integrationsIcons[integrationName]
}

export { getIntegrationIcon }
