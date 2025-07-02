export type AuctionWheelPageStylesSlots = 'pageWrapper' | 'wheelWrapper' | 'wheelTabsWrapper'

export const auctionWheelPageStyles: Record<AuctionWheelPageStylesSlots, string> = {
  wheelTabsWrapper: /* tw */ 'h-full basis-[30%] tablet:basis-[50%] landtop:basis-[40%] desktop-lg:basis-[35%] max-tablet:hidden',
  wheelWrapper: /* tw */ 'shrink w-full h-full',
  pageWrapper: /* tw */ 'w-full h-full desktop:max-w-[1950px] desktop-lg:max-w-[2150px] mx-auto pt-5',
}
