export type ProcessDonationDialogStylesSlots
  = 'contentWrapper'
  | 'header'
  | 'headerPanelWrapper'
  | 'resetButton'
  | 'panelActionsButtons'
  | 'submitButton'
  | 'closeButton'
  | 'titleDescription'
  | 'titleWrapper'
  | 'title'
  | 'footer'

export const processDonationDialogStyles: SlotsStyles<ProcessDonationDialogStylesSlots> = {
  contentWrapper: /* tw */ 'h-full w-full gap-y-4 max-tablet:relative max-tablet:flex max-tablet:flex-col max-tablet:w-full max-tablet:h-full max-tablet:pb-2 max-tablet:overflow-scroll max-tablet:gap-y-3',
  header: /* tw */ 'flex flex-col w-full mb-3 gap-y-5 max-tablet:flex-row max-tablet:items-start max-tablet:gap-x-4 max-tablet:px-2 max-tablet:py-1',
  headerPanelWrapper: /* tw */ 'w-full h-8',
  resetButton: /* tw */ 'tablet:size-8 max-tablet:w-full',
  panelActionsButtons: /* tw */ 'gap-x-2',
  closeButton: /* tw */ 'size-8',
  title: /* tw */ 'leading-5 font-medium text-white max-tablet:text-md',
  submitButton: /* tw */ 'tablet:h-full max-tablet:w-full',
  titleDescription: /* tw */ 'leading-4 font-normal text-gray-accent max-tablet:text-sm',
  titleWrapper: /* tw */ 'gap-x-4 max-tablet:w-full max-tablet:space-y-0.25',
  footer: /* tw */ 'gap-x-2 pt-2',
}
