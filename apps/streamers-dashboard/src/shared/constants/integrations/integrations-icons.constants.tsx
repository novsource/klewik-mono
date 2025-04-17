import { ReactNode, SVGProps } from 'react'

import { Icons } from '~shared/ui/icons'

import { FORMATTED_INTEGRATIONS_PLATFORMS_NAMES } from './integrations-names.constants'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: 'xs' | 'sm' | 'default' | 'lg'
}

const getIntegrationIcon = (
  integrationName: FORMATTED_INTEGRATIONS_PLATFORMS_NAMES,
  iconProps?: IconProps
) => {
  const integrationsIcons: Record<
    FORMATTED_INTEGRATIONS_PLATFORMS_NAMES,
    ReactNode
  > = {
    DonationAlerts: <Icons.DonationAlerts {...iconProps} />,
    'Donate Pay': <Icons.DonatePay {...iconProps} />,
    'Unknown/Other': undefined,
  }

  return integrationsIcons[integrationName]
}

export { getIntegrationIcon }
