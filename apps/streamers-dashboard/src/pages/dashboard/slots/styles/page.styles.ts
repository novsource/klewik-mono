type AuctionSlotsPageStylesSlots = 'base' | 'contentWrapper' | 'actionPanel'

export const auctionSlotsPageStyles: SlotsStyles<AuctionSlotsPageStylesSlots> = {

  base: /* tw */[
    'mx-auto mb-4 grid h-full w-full grid-rows-slots-table gap-y-3 pt-3 pb-26 tablet:pt-10 tablet:min-h-[var(--height-page)] tablet:h-auto',
    'mobile:gap-y-5',
    'max-tablet:max-w-[1100px] tablet:grid-rows-slots-desktop tablet:gap-y-0 tablet:pb-0 tablet:pl-4',
    'desktop:max-w-[1750px] desktop-lg:max-w-[2100px]',
    'landtop:max-w-[1600px]',
  ],
  contentWrapper: /* tw */ 'gap-x-4 pt-6 tablet:pt-1 tablet:mb-12',
  actionPanel: /* tw */ 'gap-y-0.5 tablet:gap-y-1.25 w-full',
}
