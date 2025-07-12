import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

const dialogBackdropVariants = cva([
  'fixed inset-0 z-50 bg-black/35 backdrop-blur-[3px] data-[open]:animate-in data-[closed]:animate-out data-[state=closed]:fade-out-0 data-[open]:fade-in-0',
], {
  variants: { disableAnimation: {
    true: '',
    false: 'data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0',
  } },
  defaultVariants: {
    disableAnimation: false,
  },
})

const dialogContentVariants = cva([
  'bg-dark z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg',
  'fixed translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] shadow-md',
], {
  variants: {
    disableAnimation: {
      true: '',
      false: ['duration-200', 'data-[closed]:zoom-out-95 data-[open]:zoom-in-95', 'data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0'],
    },
  },
  defaultVariants: {
    disableAnimation: false,
  },
})

const dialogHeaderVariants = cva('flex flex-col gap-2 text-center sm:text-left')

const dialogTitleVariants = cva(
  'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
)

const dialogFooterVariants = cva('flex flex-col w-full')

type DialogBackdropVariantsProps = VariantProps<typeof dialogBackdropVariants>
type DialogContentVariantsProps = VariantProps<typeof dialogContentVariants>
type DialogHeaderVariantsProps = VariantProps<typeof dialogHeaderVariants>
type DialogTitleVariantsProps = VariantProps<typeof dialogTitleVariants>
type DialogFooterVariantsProps = VariantProps<typeof dialogFooterVariants>

export type {
  DialogBackdropVariantsProps,
  DialogContentVariantsProps,
  DialogFooterVariantsProps,
  DialogHeaderVariantsProps,
  DialogTitleVariantsProps,
}
export {
  dialogContentVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogBackdropVariants as dialogOverlayVariants,
  dialogTitleVariants,
}
