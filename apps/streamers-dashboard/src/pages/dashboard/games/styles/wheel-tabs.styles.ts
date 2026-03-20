export type WheelTabsStylesSlots = 'tabTrigger' | 'tabList' | 'base'

export const wheelTabsStyles: Record<WheelTabsStylesSlots, string> = {
  base: /* tw */ 'flex w-full h-full flex-col',
  tabTrigger: /* tw */ 'flex grow cursor-pointer gap-x-2 text-md font-medium text-gray-light/70 hover:text-gray-light data-[active]:rounded-medium',
  tabList: /* tw */ 'dark flex w-full justify-between rounded-large bg-dark',
}

export type SlotsWheelTabSlots = 'content'

export const slotsWheelTabStyles: Record<SlotsWheelTabSlots, string> = {
  content: /* tw */ 'relative flex flex-col mt-5 gap-y-3 h-full',
}

export type ControlWheelTabSlots = 'content' | 'controlsWrapper' | 'spinWheelButton'

export const controlWheelTabStyles: Record<ControlWheelTabSlots, string> = {
  content: /* tw */ 'mt-5 flex flex-col gap-y-3 h-full overflow-scroll pb-4',
  controlsWrapper: /* tw */ 'w-full gap-x-2',
  spinWheelButton: /* tw */ 'w-full',
}

export type PreferencesWheelTabSlots = 'content' | 'recolorButtonWrapper'

export const preferencesWheelTabStyles: Record<PreferencesWheelTabSlots, string> = {
  content: /* tw */ 'mt-5 flex flex-col gap-y-3 h-full overflow-scroll pb-4',
  recolorButtonWrapper: /* tw */ 'w-full',
  // controlsWrapper: /* tw */ 'w-full gap-x-2',
}
