export type AuctionWheelPageStylesSlots = 'pageWrapper' | 'wheelWrapper' | 'wheelTabsWrapper'

export const auctionWheelPageStyles: Record<AuctionWheelPageStylesSlots, string> = {
  wheelTabsWrapper: /* tw */ 'w-full h-full max-tablet:hidden',
  wheelWrapper: /* tw */ 'w-full h-full grow tablet:gap-x-6',
  pageWrapper: /* tw */ 'w-full h-full desktop:max-w-[1950px] desktop-lg:max-w-[2150px] mx-auto pt-8 tablet:min-h-[var(--height-page)] tablet:h-auto',
}
