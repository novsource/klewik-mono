import type { WizardItem } from '~shared/hooks/use-wizard'

export const WELCOME_PAGE_WIZARD_ITEMS_IDS = {
  WELCOME: 'welcome',
  LOGIN_ADMIN: 'loginAdmin',
  CREATE_AUCTION: 'createAuction',
  SUCCESS_CREATE: 'successCreate',
  AUCTION_PARAMETERS: 'auctionParameters',
} as const

type WizardMap = WizardItem<typeof WELCOME_PAGE_WIZARD_ITEMS_IDS[keyof typeof WELCOME_PAGE_WIZARD_ITEMS_IDS]>[]

export const welcomePageWizardMap: WizardMap = [
  {
    id: WELCOME_PAGE_WIZARD_ITEMS_IDS.WELCOME,
    nodes: [
      WELCOME_PAGE_WIZARD_ITEMS_IDS.CREATE_AUCTION,
      WELCOME_PAGE_WIZARD_ITEMS_IDS.LOGIN_ADMIN,
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
] as const
