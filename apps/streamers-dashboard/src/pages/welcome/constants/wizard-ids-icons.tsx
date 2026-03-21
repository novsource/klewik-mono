import type { WELCOME_PAGE_WIZARD_ITEMS_IDS } from './wizard-items-ids'

import type { ReactNode } from 'react'

import { Icons } from 'klewik-ui/icons'

const WELCOME_PAGE_WIZARD_IDS_ICONS: Record<
  (typeof WELCOME_PAGE_WIZARD_ITEMS_IDS)[keyof typeof WELCOME_PAGE_WIZARD_ITEMS_IDS],
  ReactNode | undefined
> = {
  login: <Icons.Plus />,
  createAuction: <Icons.Plus />,
  auctionParameters: undefined,
  loginAdmin: <Icons.Login size="sm" />,
  successCreate: undefined,
  welcome: undefined,
}

export { WELCOME_PAGE_WIZARD_IDS_ICONS }
