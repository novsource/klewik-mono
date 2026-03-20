export type CreateSlotsFormStylesSlots
  = 'form'
    | 'formInputsWrapper'
    | 'submitButton'
    | 'tabs'
    | 'tabsList'
    | 'tabTrigger'
    | 'isErrorTabTrigger'
    | 'addNewTabButton'

export const createSlotsFormStyles: SlotsStyles<CreateSlotsFormStylesSlots> = {
  form: /* tw */ 'flex h-full w-full flex-col justify-between overflow-x-clip',
  formInputsWrapper: /* tw */ 'relative flex w-full flex-col gap-y-4 px-0.25',
  submitButton: /* tw */ 'w-full',
  tabs: /* tw */ 'space-y-6',
  tabsList: /* tw */ 'flex w-fit justify-between rounded-large bg-dark',
  tabTrigger: /* tw */ 'flex cursor-pointer gap-x-1 text-md font-medium text-gray-light/70 hover:text-gray-light data-[state=active]:rounded-[8px] data-[state=active]:[&_button]:block',
  isErrorTabTrigger: /* tw */ 'text-red/40 hover:text-red/60 data-[state=active]:hover:text-red data-[state=active]:text-red',
  addNewTabButton: /* tw */ 'transition-colors text-gray-light hover:text-gray-accent',
}
