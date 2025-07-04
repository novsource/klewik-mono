type AuctionSlotsPageStylesSlots = 'base' | 'contentWrapper' | 'actionPanel'

export const auctionSlotsPageStyles: SlotsStyles<AuctionSlotsPageStylesSlots> = {

  base: /* tw */ [
    'mx-auto mb-4 grid h-full w-full grid-rows-slots-table gap-y-3 tablet:pt-5',
    'mobile:gap-y-5',
    'max-tablet:max-w-[1100px] tablet:grid-rows-slots-desktop tablet:gap-y-4 tablet:pl-10',
    'desktop:max-w-[1750px] desktop-lg:max-w-[2100px]',
    'landtop:max-w-[1600px]',
  ],
  contentWrapper: /* tw */ 'gap-x-4 pt-1',
  actionPanel: /* tw */ 'tablet:gap-x-2',
}
