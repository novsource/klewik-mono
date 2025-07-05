export type CreateSlotsSheetStylesSlots
  = 'contentWrapper'
    | 'header'
    | 'headerPanelWrapper'
    | 'resetButton'
    | 'panelActionsButtons'
    | 'submitButton'
    | 'closeButton'
    | 'titleDescription'
    | 'titleWrapper'

export const createSlotsSheetStyles: SlotsStyles<CreateSlotsSheetStylesSlots> = {
  contentWrapper: /* tw */ 'h-full w-full gap-y-4',
  header: /* tw */ 'flex flex-col w-full gap-y-5',
  headerPanelWrapper: /* tw */ 'w-full h-8',
  resetButton: /* tw */ 'size-8',
  panelActionsButtons: /* tw */ 'gap-x-2',
  closeButton: /* tw */ 'size-8',
  submitButton: /* tw */ 'h-full',
  titleDescription: /* tw */ 'leading-4 font-normal text-gray-accent',
  titleWrapper: /* tw */ 'gap-x-4',
}

export type CreateSlotsDrawerStylesSlots
  = 'contentWrapper'
    | 'header'
    | 'titleWrapper'
    | 'title'
    | 'closeButton'
    | 'footer'
    | 'resetButton'
    | 'submitButton'

export const createSlotsDialogStyles: SlotsStyles<CreateSlotsDrawerStylesSlots> = {
  contentWrapper: /* tw */ 'relative flex flex-col w-full h-full px-4 pb-2 overflow-scroll',
  header: /* tw */ 'flex-row items-center gap-x-4 px-2',
  titleWrapper: /* tw */ 'w-full space-y-0.25',
  title: /* tw */ 'leading-5 font-medium text-white max-tablet:text-md',
  closeButton: /* tw */ 'size-8',
  footer: /* tw */ 'flex flex-row px-0 pb-1',
  resetButton: /* tw */ 'w-full',
  submitButton: /* tw */ 'w-full',
}
