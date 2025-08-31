import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

export const sheetVariants = cva(
  [
    'dark fixed z-50 gap-4 bg-dark-foreground',
    'transition ease-in-out data-[open]:animate-enter-sheet data-[closed]:animate-exit-sheet data-[closed]:duration-200 data-[open]:duration-300',
    'translate-none left-auto top-auto',
  ],
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[closed]:slide-out-to-top data-[open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[closed]:slide-out-to-bottom data-[open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[open]:slide-in-from-left sm:max-w-sm',
        right: [
          'inset-y-0 border border-dark-accent my-auto right-2.5 h-sheet rounded-large w-3/4',
          'landtop:max-w-[500px] desktop:max-w-[550px] tablet:max-w-[450px]',
          'data-[closed]:slide-out-to-right data-[open]:slide-in-from-right',
        ],
      },
      isFullPageSize: {
        true: 'w-full h-full max-w-screen max-h-screen border-0 rounded-none',
        false: '',
      },
    },
    defaultVariants: {
      side: 'right',
      isFullPageSize: false,
    },
  },
)

export type SheetVariantsProps = VariantProps<typeof sheetVariants>

export const sheetBackdropVariants = cva(
  'fixed inset-0 z-50 bg-black/40',
)

export const sheetHeaderVariants = cva('flex flex-col space-y-2 text-left')

export const sheetTitleVariants = cva('text-title-xl font-semibold text-white')

export const sheetDescriptionVariants = cva('text-md text-muted-foreground')

export const sheetCloseButtonVariants = cva(
  'absolute right-5 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[open]:bg-secondary',
)

export const sheetFooterVariants = cva(
  'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
)
