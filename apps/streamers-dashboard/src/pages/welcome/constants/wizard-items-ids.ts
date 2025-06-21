import type { WizardItem } from '~shared/hooks/use-wizard'

const WELCOME_PAGE_WIZARD_ITEMS_IDS = {
  WELCOME: 'welcome',
  CHOOSE_ROLES: 'chooseRoles',
  LOGIN_GUEST: 'loginGuest',
  LOGIN_ADMIN: 'loginAdmin',
  CREATE_AUCTION: 'createAuction',
  SUCCESS_CREATE: 'successCreate',
  AUCTION_PARAMETERS: 'auctionParameters',
} as const

const welcomePageWizardMap: WizardItem<string>[] = [
  {
    id: WELCOME_PAGE_WIZARD_ITEMS_IDS.WELCOME,
    nodes: [
      WELCOME_PAGE_WIZARD_ITEMS_IDS.CREATE_AUCTION,
      WELCOME_PAGE_WIZARD_ITEMS_IDS.CHOOSE_ROLES,
    ],
  },
  {
    id: WELCOME_PAGE_WIZARD_ITEMS_IDS.CREATE_AUCTION,
    nodes: [WELCOME_PAGE_WIZARD_ITEMS_IDS.AUCTION_PARAMETERS],
  },
  {
    id: WELCOME_PAGE_WIZARD_ITEMS_IDS.AUCTION_PARAMETERS,
    nodes: [WELCOME_PAGE_WIZARD_ITEMS_IDS.SUCCESS_CREATE],
  },
  {
    id: WELCOME_PAGE_WIZARD_ITEMS_IDS.CHOOSE_ROLES,
    nodes: [
      WELCOME_PAGE_WIZARD_ITEMS_IDS.LOGIN_GUEST,
      WELCOME_PAGE_WIZARD_ITEMS_IDS.LOGIN_ADMIN,
    ],
  },
] as const

export { WELCOME_PAGE_WIZARD_ITEMS_IDS, welcomePageWizardMap }
