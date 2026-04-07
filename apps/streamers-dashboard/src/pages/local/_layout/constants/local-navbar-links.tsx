import type { NavbarLinkItem } from '~widgets/dashboard-navbar/ui'

import { Icons } from 'klewik-ui/icons'

export const LOCAL_NAVBAR_LINKS: NavbarLinkItem[] = [
  {
    path: 'games',
    icon: (props: IconsProps) => <Icons.Gamepad {...props} />,
  },
  {
    path: 'slots',
    icon: props => <Icons.Slots {...props} />,
  },
]
