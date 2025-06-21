import { ReactNode } from 'react'

import { Icons } from '~shared/ui/icons'

import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from './wizard-items-ids'

const WELCOME_PAGE_WIZARD_IDS_ICONS: Record<
  (typeof WELCOME_PAGE_WIZARD_ITEMS_IDS)[keyof typeof WELCOME_PAGE_WIZARD_ITEMS_IDS],
  ReactNode | undefined
> = {
  chooseRoles: <Icons.Login width={18} height={18} />,
  createAuction: <Icons.Plus />,
  auctionParameters: undefined,
  loginAdmin: <Icons.Crown />,
  loginGuest: <Icons.Face />,
  successCreate: undefined,
  welcome: undefined,
}

export { WELCOME_PAGE_WIZARD_IDS_ICONS }
