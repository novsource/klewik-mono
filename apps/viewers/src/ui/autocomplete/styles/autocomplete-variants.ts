import { cva } from 'class-variance-authority'

export const autocompleteVariants = cva('')

export const autocompleteItemVariants = cva([
  'bg-foreground flex cursor-pointer py-2 pr-8 pl-4 text-md leading-4 outline-none select-none',
  'data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-accent data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-2 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-dark',
])

export const autocompleteEmptyVariants = cva(['bg-dark px-4 py-2 text-[0.925rem] leading-4 text-gray-600 empty:m-0 empty:p-0'])

export const autocompletePopupVariants = cva([
  'bg-foreground border-white',
  'w-[var(--anchor-width)] max-h-[min(var(--available-height),23rem)] max-w-[var(--available-width)]',
  'overflow-y-auto scroll-pt-2 scroll-pb-2 overscroll-contain rounded-md bg-[canvas] py-2 text-gray-light shadow-lg shadow-gray-200 outline-1 outline-dark-accent dark:shadow-none dark:-outline-offset-1 dark:outline-dark-light',
])
